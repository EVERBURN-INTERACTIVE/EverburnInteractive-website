import * as THREE from 'three';
import { ParticleBuffer } from './buffer';
import { getParticleModule, type ModuleContext } from './modules';
import type { ParticleEmitterDefinition, ParticleSimulationSpace } from './types';

/** Deterministic 32-bit PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPRITE_VERTEX_SHADER = /* glsl */ `
  attribute vec4 aColor;
  attribute float aSize;
  varying vec4 vColor;
  uniform float uScale;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale * (300.0 / max(0.001, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const SPRITE_FRAGMENT_SHADER = /* glsl */ `
  varying vec4 vColor;
  uniform sampler2D uTexture;
  uniform bool uHasTexture;
  void main() {
    vec2 uv = gl_PointCoord;
    float alpha = vColor.a;
    if (uHasTexture) {
      vec4 tex = texture2D(uTexture, uv);
      gl_FragColor = vec4(vColor.rgb * tex.rgb, alpha * tex.a);
    } else {
      // Soft radial falloff for a glowing dot.
      float d = length(uv - vec2(0.5));
      float soft = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vColor.rgb, alpha * soft);
    }
    if (gl_FragColor.a < 0.003) discard;
  }
`;

/**
 * Runtime state and renderer for a single emitter. Owns a {@link ParticleBuffer}
 * (CPU simulation) and a Three.js render object (GPU rendering). Sprite
 * emitters render as `THREE.Points` with a per-particle size/color shader;
 * mesh emitters render as `THREE.InstancedMesh`. Ribbon support is reserved
 * for a later milestone and falls back to sprite rendering with a warning.
 * See PRD 11 §3.4.
 */
export class EmitterRuntime {
  readonly def: ParticleEmitterDefinition;
  readonly buffer: ParticleBuffer;
  /** Three.js object that draws this emitter. Attached by the host system. */
  readonly object3D: THREE.Object3D;

  private readonly _rng: () => number;
  private _spawnAccumulator = 0;
  private _burstTimer = 0;
  private _emitterAge = 0;
  private _active = true;

  // Sprite render resources.
  private _points: THREE.Points | undefined;
  private _geometry: THREE.BufferGeometry | undefined;
  private _material: THREE.ShaderMaterial | undefined;
  private _colorAttr: THREE.BufferAttribute | undefined;
  private _sizeAttr: THREE.BufferAttribute | undefined;
  private _posAttr: THREE.BufferAttribute | undefined;

  // Mesh render resources.
  private _instanced: THREE.InstancedMesh | undefined;
  private readonly _tmpMatrix = new THREE.Matrix4();
  private readonly _tmpColor = new THREE.Color();
  private readonly _tmpQuat = new THREE.Quaternion();
  private readonly _tmpScale = new THREE.Vector3();
  private readonly _tmpPos = new THREE.Vector3();

  constructor(def: ParticleEmitterDefinition, masterSeed: number) {
    this.def = def;
    const capacity = Math.max(1, Math.floor(def.capacity));
    this.buffer = new ParticleBuffer(capacity);
    this._rng = mulberry32(masterSeed ^ hashString(def.name));

    if (def.renderer === 'mesh') {
      this.object3D = this._createMeshRenderer(capacity);
    } else {
      if (def.renderer === 'ribbon') {
        console.warn(
          `[ParticleSystem] Ribbon renderer is not implemented in v1; ` +
            `emitter "${def.name}" falls back to sprites.`,
        );
      }
      this.object3D = this._createSpriteRenderer(capacity);
    }
    this.object3D.frustumCulled = false;
  }

  /** True while the emitter is spawning or still has live particles. */
  get isFinished(): boolean {
    return !this._active && this.buffer.count === 0;
  }

  /** Reset emitter time/particles (used by restart). */
  reset(): void {
    this.buffer.count = 0;
    this._spawnAccumulator = 0;
    this._burstTimer = 0;
    this._emitterAge = 0;
    this._active = true;
  }

  /**
   * Advance one simulation step.
   * @param dt Delta time in seconds (already scaled by playback speed).
   * @param origin Spawn origin in the emitter's simulation space.
   * @param space Effective simulation space.
   * @param gravity World gravity vector.
   * @param globals System/global parameters.
   * @param emissionScale Multiplier applied to the spawn rate.
   */
  update(
    dt: number,
    origin: readonly [number, number, number],
    space: ParticleSimulationSpace,
    gravity: readonly [number, number, number],
    globals: ReadonlyMap<string, number | readonly number[]>,
    emissionScale: number,
  ): void {
    const ctx: ModuleContext = { random: this._rng, gravity, globals };

    this._emitterAge += dt;
    const duration = this.def.spawn.duration;
    if (duration > 0 && this._emitterAge >= duration) {
      if (this.def.spawn.looping) this._emitterAge %= duration;
      else this._active = false;
    }

    // Spawn new particles (continuous rate + optional bursts).
    if (this._active && this.def.enabled) {
      this._spawnAccumulator += Math.max(0, this.def.spawn.rate) * emissionScale * dt;
      let toSpawn = Math.floor(this._spawnAccumulator);
      this._spawnAccumulator -= toSpawn;

      const burstCount = this.def.spawn.burstCount ?? 0;
      const burstInterval = this.def.spawn.burstInterval ?? 0;
      if (burstCount > 0 && burstInterval > 0) {
        this._burstTimer += dt;
        while (this._burstTimer >= burstInterval) {
          this._burstTimer -= burstInterval;
          toSpawn += burstCount;
        }
      }

      for (let s = 0; s < toSpawn; s++) {
        const i = this.buffer.spawn();
        if (i < 0) break;
        this.buffer.seed[i] = this._rng();
        if (space === 'world') {
          this.buffer.posX[i] = origin[0];
          this.buffer.posY[i] = origin[1];
          this.buffer.posZ[i] = origin[2];
        }
        for (const ref of this.def.initialModules) {
          getParticleModule(ref.type)?.init?.(this.buffer, i, ref.params, ctx);
        }
        this.buffer.captureStartValues(i);
      }
    }

    // Update + integrate + cull.
    const buf = this.buffer;
    for (let i = 0; i < buf.count; ) {
      buf.age[i] += dt;
      for (const ref of this.def.updateModules) {
        getParticleModule(ref.type)?.update?.(buf, i, dt, ref.params, ctx);
      }
      if (buf.age[i] >= buf.life[i]) {
        buf.kill(i);
        continue; // index now holds the swapped-in particle.
      }
      i++;
    }

    this._uploadToGpu();
  }

  /** Release GPU resources. */
  dispose(): void {
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._instanced) {
      this._instanced.geometry.dispose();
      (this._instanced.material as THREE.Material).dispose();
    }
    this.object3D.parent?.remove(this.object3D);
  }

  private _createSpriteRenderer(capacity: number): THREE.Object3D {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(capacity * 3);
    const colors = new Float32Array(capacity * 4);
    const sizes = new Float32Array(capacity);
    this._posAttr = new THREE.BufferAttribute(positions, 3);
    this._colorAttr = new THREE.BufferAttribute(colors, 4);
    this._sizeAttr = new THREE.BufferAttribute(sizes, 1);
    this._posAttr.setUsage(THREE.DynamicDrawUsage);
    this._colorAttr.setUsage(THREE.DynamicDrawUsage);
    this._sizeAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', this._posAttr);
    geometry.setAttribute('aColor', this._colorAttr);
    geometry.setAttribute('aSize', this._sizeAttr);
    geometry.setDrawRange(0, 0);

    const additive = this.def.sprite?.blend !== 'normal';
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uScale: { value: 1 },
        uTexture: { value: null },
        uHasTexture: { value: false },
      },
      vertexShader: SPRITE_VERTEX_SHADER,
      fragmentShader: SPRITE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this._geometry = geometry;
    this._material = material;
    const points = new THREE.Points(geometry, material);
    points.name = `Emitter:${this.def.name}`;
    this._points = points;
    return points;
  }

  private _createMeshRenderer(capacity: number): THREE.Object3D {
    // v1 fallback geometry: a small box. Mesh-asset resolution is a later step.
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geometry, material, capacity);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.count = 0;
    mesh.name = `Emitter:${this.def.name}`;
    this._instanced = mesh;
    return mesh;
  }

  private _uploadToGpu(): void {
    const buf = this.buffer;
    if (this._points && this._posAttr && this._colorAttr && this._sizeAttr) {
      const pos = this._posAttr.array as Float32Array;
      const col = this._colorAttr.array as Float32Array;
      const siz = this._sizeAttr.array as Float32Array;
      for (let i = 0; i < buf.count; i++) {
        pos[i * 3] = buf.posX[i];
        pos[i * 3 + 1] = buf.posY[i];
        pos[i * 3 + 2] = buf.posZ[i];
        col[i * 4] = buf.r[i];
        col[i * 4 + 1] = buf.g[i];
        col[i * 4 + 2] = buf.b[i];
        col[i * 4 + 3] = buf.a[i];
        siz[i] = buf.size[i];
      }
      this._posAttr.needsUpdate = true;
      this._colorAttr.needsUpdate = true;
      this._sizeAttr.needsUpdate = true;
      this._geometry?.setDrawRange(0, buf.count);
      return;
    }
    if (this._instanced) {
      for (let i = 0; i < buf.count; i++) {
        this._tmpPos.set(buf.posX[i], buf.posY[i], buf.posZ[i]);
        this._tmpQuat.setFromAxisAngle(UP, buf.rotation[i]);
        this._tmpScale.setScalar(buf.size[i]);
        this._tmpMatrix.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        this._instanced.setMatrixAt(i, this._tmpMatrix);
        this._tmpColor.setRGB(buf.r[i], buf.g[i], buf.b[i]);
        this._instanced.setColorAt(i, this._tmpColor);
      }
      this._instanced.count = buf.count;
      this._instanced.instanceMatrix.needsUpdate = true;
      if (this._instanced.instanceColor) this._instanced.instanceColor.needsUpdate = true;
    }
  }
}

const UP = new THREE.Vector3(0, 1, 0);

/** Cheap string hash for seeding per-emitter RNGs. */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
