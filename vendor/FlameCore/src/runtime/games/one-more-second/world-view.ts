import * as THREE from 'three';
import type { SimEvents, SimReadout, SimObstacle, SimFragment } from './types';
import { burstScale, spawnPlayerBurst, stepPlayerBurst, type DebrisShard } from './player-burst';
import { OneMoreSecondGalaxySky, type OmsViewQuality } from './galaxy-sky';

const MAX_OBS = 80;
const MAX_FRAG = 24;
const HOOP_COUNT = 16;
const RIB_COUNT = 28;
const TRAIL_COUNT = 140;
const STREAK_COUNT = 70;
const DUST_COUNT = 180;
const MAX_DEBRIS = 28;

const _obj = new THREE.Object3D();
const _color = new THREE.Color();

function neonMat(color: number, emissive: number, intensity: number, extra?: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: intensity,
    metalness: 0.35,
    roughness: 0.28,
    ...extra,
  });
}

function makeGridTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === 'undefined') return undefined;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 1024;
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = c.getContext('2d');
  } catch {
    return undefined;
  }
  if (!ctx) return undefined;
  ctx.fillStyle = '#05070f';
  ctx.fillRect(0, 0, 512, 1024);
    ctx.strokeStyle = 'rgba(92, 225, 255, 0.38)';
    ctx.lineWidth = 2;
    for (let y = 0; y <= 1024; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let x = 0; x <= 512; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 1008);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.repeat.set(1, 8);
  return tex;
}

/**
 * Pooled Three.js view for the endless corridor. Not serialized — rebuilt
 * whenever the gameplay component attaches.
 */
export class OneMoreSecondWorldView {
  readonly root = new THREE.Group();
  private readonly _player = new THREE.Group();
  private readonly _goldRing = new THREE.Group();
  private readonly _obsMesh: THREE.InstancedMesh;
  private readonly _fragMesh: THREE.InstancedMesh;
  private readonly _hoops: THREE.InstancedMesh;
  private readonly _ribs: THREE.InstancedMesh;
  private readonly _floor: THREE.Mesh;
  private readonly _leftWall: THREE.Mesh;
  private readonly _rightWall: THREE.Mesh;
  private readonly _ceiling: THREE.Mesh;
  private readonly _trail: THREE.Points;
  private readonly _streaks: THREE.LineSegments;
  private readonly _dust: THREE.Points;
  private readonly _playerLight: THREE.PointLight;
  private readonly _debrisMesh: THREE.InstancedMesh;
  private _debris: DebrisShard[] = [];
  private readonly _galaxy: OneMoreSecondGalaxySky;
  private readonly _floorTex: THREE.CanvasTexture | undefined;
  private readonly _disposables: Array<{ dispose(): void }> = [];
  private readonly _trailPos: Float32Array;
  private readonly _streakPos: Float32Array;
  private readonly _dustPos: Float32Array;
  private _trailHead = 0;
  private _time = 0;

  constructor(quality: OmsViewQuality = 'high') {
    this.root.name = 'OneMoreSecondWorld';
    const low = quality === 'low';

    this._floorTex = makeGridTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x121a28,
      metalness: 0.55,
      roughness: 0.28,
      map: this._floorTex ?? null,
      emissive: 0x0a3040,
      emissiveIntensity: 0.85,
    });
    this._floor = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 220), floorMat);
    this._floor.rotation.x = -Math.PI / 2;
    this._floor.position.set(0, 0, 90);
    this._floor.receiveShadow = !low;
    this.root.add(this._floor);

    const wallMat = neonMat(0x10182a, 0x5ce1ff, 0.42, {
      metalness: 0.72,
      roughness: 0.22,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const wallGeo = new THREE.PlaneGeometry(220, 4.4);
    this._leftWall = new THREE.Mesh(wallGeo, wallMat);
    this._rightWall = new THREE.Mesh(wallGeo, wallMat);
    this._leftWall.rotation.y = Math.PI / 2;
    this._rightWall.rotation.y = -Math.PI / 2;
    this._leftWall.position.set(-3.3, 2.1, 90);
    this._rightWall.position.set(3.3, 2.1, 90);
    this.root.add(this._leftWall, this._rightWall);

    const ceilMat = neonMat(0x070b14, 0x6a3cff, 0.18, {
      metalness: 0.7,
      roughness: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
    });
    this._ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 220), ceilMat);
    this._ceiling.rotation.x = Math.PI / 2;
    this._ceiling.position.set(0, 4.15, 90);
    this.root.add(this._ceiling);

    const hoopGeo = new THREE.TorusGeometry(3.9, 0.1, low ? 6 : 8, low ? 24 : 48);
    const hoopMat = neonMat(0x5ce1ff, 0x5ce1ff, 4.2, { metalness: 0.05, roughness: 0.12 });
    this._hoops = new THREE.InstancedMesh(hoopGeo, hoopMat, HOOP_COUNT);
    this._hoops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._hoops.frustumCulled = false;
    this.root.add(this._hoops);

    const ribGeo = new THREE.BoxGeometry(0.1, 4.1, 0.1);
    const ribMat = neonMat(0x5ce1ff, 0x5ce1ff, 2.4);
    this._ribs = new THREE.InstancedMesh(ribGeo, ribMat, RIB_COUNT);
    this._ribs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._ribs.frustumCulled = false;
    this.root.add(this._ribs);

    const obsGeo = new THREE.BoxGeometry(1, 1, 1);
    const obsMat = neonMat(0xff2d6a, 0xff2d6a, 2.4, { metalness: 0.12, roughness: 0.22 });
    this._obsMesh = new THREE.InstancedMesh(obsGeo, obsMat, MAX_OBS);
    this._obsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._obsMesh.castShadow = !low;
    this._obsMesh.frustumCulled = false;
    this.root.add(this._obsMesh);

    const fragGeo = new THREE.IcosahedronGeometry(0.22, 1);
    this._fragMesh = new THREE.InstancedMesh(fragGeo, neonMat(0xffe566, 0xffe566, 3.8, { metalness: 0.08, roughness: 0.18 }), MAX_FRAG);
    this._fragMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._fragMesh.frustumCulled = false;
    this.root.add(this._fragMesh);

    this._buildPlayer(!low);
    this._trailPos = new Float32Array(TRAIL_COUNT * 3);
    this._trail = new THREE.Points(
      this._makeBuffer(this._trailPos),
      new THREE.PointsMaterial({
        color: 0x5ce1ff,
        size: 0.12,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    this._trail.frustumCulled = false;
    this.root.add(this._trail);

    this._streakPos = new Float32Array(STREAK_COUNT * 6);
    this._streaks = new THREE.LineSegments(
      this._makeBuffer(this._streakPos),
      new THREE.LineBasicMaterial({
        color: 0xa8f4ff,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this._streaks.frustumCulled = false;
    this.root.add(this._streaks);

    this._dustPos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      this._dustPos[i * 3] = (Math.random() - 0.5) * 6;
      this._dustPos[i * 3 + 1] = Math.random() * 3.6;
      this._dustPos[i * 3 + 2] = Math.random() * 120;
    }
    this._dust = new THREE.Points(
      this._makeBuffer(this._dustPos),
      new THREE.PointsMaterial({
        color: 0x7fd7ff,
        size: 0.045,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this._dust.frustumCulled = false;
    this.root.add(this._dust);

    this._playerLight = new THREE.PointLight(0x7fefff, 5.2, 16, 1.6);
    this._player.add(this._playerLight);
    this.root.add(this._player);

    const debrisGeo = new THREE.TetrahedronGeometry(0.5);
    const debrisMat = neonMat(0xc8fbff, 0x5ce1ff, 3.6, { metalness: 0.08, roughness: 0.22 });
    this._debrisMesh = new THREE.InstancedMesh(debrisGeo, debrisMat, MAX_DEBRIS);
    this._debrisMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._debrisMesh.frustumCulled = false;
    this._debrisMesh.count = 0;
    this.root.add(this._debrisMesh);

    this._galaxy = new OneMoreSecondGalaxySky(quality);
    this.root.add(this._galaxy.root);

    this._track(
      hoopGeo,
      hoopMat,
      ribGeo,
      ribMat,
      wallGeo,
      wallMat,
      ceilMat,
      floorMat,
      obsGeo,
      obsMat,
      fragGeo,
      this._fragMesh.material as THREE.Material,
      this._trail.geometry,
      this._trail.material as THREE.Material,
      this._streaks.geometry,
      this._streaks.material as THREE.Material,
      this._dust.geometry,
      this._dust.material as THREE.Material,
      debrisGeo,
      debrisMat,
    );
    if (this._floorTex) this._track(this._floorTex);
  }

  attach(scene: THREE.Scene): void {
    scene.add(this.root);
  }

  sync(readout: SimReadout, events: SimEvents, dt: number): void {
    this._time += dt;
    const dist = readout.distance;
    if (this._floorTex) this._floorTex.offset.y = (dist * 0.035) % 1;

    const hw = readout.halfWidth + 0.15;
    this._leftWall.position.x = -hw;
    this._rightWall.position.x = hw;
    this._floor.scale.x = (hw * 2) / 8.4;
    this._ceiling.scale.x = (hw * 2) / 8.4;

    this._layoutHoops(dist, hw, readout.intensity);
    this._layoutRibs(dist, hw);
    this._layoutObstacles(readout.obstacles, readout);
    this._layoutFragments(readout.fragments, this._time);
    this._layoutPlayer(readout, dt);
    this._layoutBurst(readout, events, dt);
    this._layoutTrail(readout, dt);
    this._layoutStreaks(readout, dt);
    this._layoutDust(readout, dt);
    this._galaxy.sync(dt, readout.speedMul);

    if (this._player.visible) {
      if (events.nearMiss) this._playerLight.intensity = 5.5;
      else this._playerLight.intensity = THREE.MathUtils.lerp(this._playerLight.intensity, 2.4 + readout.intensity, 0.12);
    }
    this.root.position.x = 0;
  }

  dispose(scene: THREE.Scene): void {
    scene.remove(this.root);
    this.root.removeFromParent();
    this._galaxy.dispose();
    for (const d of this._disposables) d.dispose();
    this._disposables.length = 0;
  }

  private _buildPlayer(castShadow: boolean): void {
    // Same bounding sphere as the old IcosahedronGeometry(0.32) player.
    const radius = 0.32;
    const size = (radius * 2) / Math.sqrt(3);
    const edge = 0.018;
    const half = size / 2;
    const coreGeo = new THREE.BoxGeometry(size, size, size);
    const coreMat = neonMat(0xc8fbff, 0x5ce1ff, 4.2, {
      metalness: 0.1,
      roughness: 0.18,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.castShadow = castShadow;
    this._player.add(core);

    const edgeMat = neonMat(0x5a000c, 0x8b0014, 1.35, {
      metalness: 0.25,
      roughness: 0.42,
    });
    const edgeGeos: THREE.BufferGeometry[] = [];
    const addEdge = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, edgeMat);
      mesh.position.set(x, y, z);
      mesh.castShadow = false;
      this._player.add(mesh);
      edgeGeos.push(geo);
    };
    for (const y of [-half, half]) {
      for (const z of [-half, half]) {
        addEdge(size + edge, edge, edge, 0, y, z);
      }
    }
    for (const x of [-half, half]) {
      for (const z of [-half, half]) {
        addEdge(edge, size + edge, edge, x, 0, z);
      }
    }
    for (const x of [-half, half]) {
      for (const y of [-half, half]) {
        addEdge(edge, edge, size + edge, x, y, 0);
      }
    }

    const goldMat = neonMat(0xe8c45a, 0xffd56a, 2.6, {
      metalness: 0.55,
      roughness: 0.28,
    });
    const vertGeo = new THREE.SphereGeometry(0.026, 8, 6);
    for (const x of [-half, half]) {
      for (const y of [-half, half]) {
        for (const z of [-half, half]) {
          const vert = new THREE.Mesh(vertGeo, goldMat);
          vert.position.set(x, y, z);
          this._player.add(vert);
        }
      }
    }

    const ringGeo = new THREE.TorusGeometry(0.38, 0.016, 8, 40);
    const ringMat = neonMat(0xffffff, 0x5ce1ff, 2.8);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    this._player.add(ring);

    const goldRing = new THREE.Mesh(ringGeo, goldMat);
    this._goldRing.add(goldRing);
    this._player.add(this._goldRing);

    this._player.position.set(0, 0.92, 0);
    this._track(coreGeo, coreMat, edgeMat, goldMat, vertGeo, ringGeo, ringMat, ...edgeGeos);
  }

  private _layoutPlayer(readout: SimReadout, dt: number): void {
    this._player.position.set(readout.playerX, readout.playerY, readout.playerZ);
    this._player.rotation.z = -readout.playerX * 0.08;
    this._player.rotation.x += dt * (1.2 + readout.speedMul);
    this._goldRing.rotation.y += dt * (1.35 + readout.speedMul);
    const pulse = 1 + Math.sin(this._time * 8) * 0.04 + readout.intensity * 0.08;
    this._player.scale.setScalar(pulse);
    if (readout.phase === 'crash' || readout.phase === 'dead') {
      this._player.visible = false;
    } else {
      this._player.visible = true;
    }
  }

  private _layoutBurst(readout: SimReadout, events: SimEvents, dt: number): void {
    if (events.crashed) {
      this._debris = spawnPlayerBurst(readout.playerX, readout.playerY, readout.playerZ);
      this._playerLight.intensity = 9;
    } else if (
      readout.phase === 'playing' ||
      readout.phase === 'attract' ||
      readout.phase === 'rewinding' ||
      readout.phase === 'countdown'
    ) {
      this._debris = [];
    } else {
      this._debris = stepPlayerBurst(this._debris, dt);
    }

    const n = Math.min(MAX_DEBRIS, this._debris.length);
    for (let i = 0; i < n; i++) {
      const s = this._debris[i]!;
      _obj.position.set(s.x, s.y, s.z);
      _obj.rotation.set(s.rx, s.ry, s.rz);
      const sc = burstScale(s);
      _obj.scale.setScalar(sc);
      _obj.updateMatrix();
      this._debrisMesh.setMatrixAt(i, _obj.matrix);
    }
    this._debrisMesh.count = n;
    this._debrisMesh.instanceMatrix.needsUpdate = true;
    this._debrisMesh.visible = n > 0;
  }

  private _layoutHoops(dist: number, hw: number, intensity: number): void {
    const spacing = 10;
    const phase = dist % spacing;
    const cy = 4.15 / 2;
    const outer = Math.hypot(hw, cy) + 0.45;
    const scale = outer / 3.9;
    for (let i = 0; i < HOOP_COUNT; i++) {
      const z = i * spacing - phase + 4;
      _obj.position.set(0, cy, z);
      _obj.rotation.set(0, 0, 0);
      _obj.scale.set(scale, scale, 1);
      _obj.updateMatrix();
      this._hoops.setMatrixAt(i, _obj.matrix);
    }
    this._hoops.count = HOOP_COUNT;
    this._hoops.instanceMatrix.needsUpdate = true;
    (this._hoops.material as THREE.MeshStandardMaterial).emissiveIntensity = 3.2 + intensity * 2.8;
  }

  private _layoutRibs(dist: number, hw: number): void {
    const spacing = 6;
    const phase = dist % spacing;
    for (let i = 0; i < RIB_COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = Math.floor(i / 2) * spacing - phase + 2;
      _obj.position.set(side * hw, 2.05, z);
      _obj.rotation.set(0, 0, 0);
      _obj.scale.set(1, 1, 1);
      _obj.updateMatrix();
      this._ribs.setMatrixAt(i, _obj.matrix);
    }
    this._ribs.count = RIB_COUNT;
    this._ribs.instanceMatrix.needsUpdate = true;
  }

  private _layoutObstacles(list: readonly SimObstacle[], readout: SimReadout): void {
    const n = Math.min(MAX_OBS, list.length);
    for (let i = 0; i < n; i++) {
      const o = list[i]!;
      const moving = o.kind === 'moving';
      _color.set(moving ? 0xffb020 : o.kind === 'wide' ? 0xff4d3d : 0xff2d6a);
      _obj.position.set(o.x, o.y, o.z);
      _obj.rotation.set(0, readout.glitch > 0.3 ? Math.sin(this._time * 20 + o.id) * readout.glitch * 0.2 : 0, 0);
      _obj.scale.set(o.halfW * 2, o.halfH * 2, o.halfD * 2);
      _obj.updateMatrix();
      this._obsMesh.setMatrixAt(i, _obj.matrix);
      this._obsMesh.setColorAt(i, _color);
    }
    this._obsMesh.count = n;
    this._obsMesh.instanceMatrix.needsUpdate = true;
    if (this._obsMesh.instanceColor) this._obsMesh.instanceColor.needsUpdate = true;
    (this._obsMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.6 + readout.intensity * 1.1;
  }

  private _layoutFragments(list: readonly SimFragment[], time: number): void {
    const live = list.filter((f) => !f.collected);
    const n = Math.min(MAX_FRAG, live.length);
    for (let i = 0; i < n; i++) {
      const f = live[i]!;
      const bob = Math.sin(time * 5 + f.id) * 0.12;
      _obj.position.set(f.x, f.y + bob, f.z);
      _obj.rotation.set(time * 2, time * 1.4, 0);
      _obj.scale.setScalar(1);
      _obj.updateMatrix();
      this._fragMesh.setMatrixAt(i, _obj.matrix);
    }
    this._fragMesh.count = n;
    this._fragMesh.instanceMatrix.needsUpdate = true;
  }

  private _scrollSpeed(readout: SimReadout): number {
    if (readout.phase === 'rewinding') return -Math.abs(readout.speed);
    if (readout.phase === 'playing' || readout.phase === 'attract') return readout.speed;
    return 0;
  }

  private _layoutTrail(readout: SimReadout, dt: number): void {
    const speed = this._scrollSpeed(readout);
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const zi = i * 3 + 2;
      this._trailPos[zi] -= speed * dt;
    }
    this._trailHead = (this._trailHead + 1) % TRAIL_COUNT;
    const h = this._trailHead * 3;
    if (this._player.visible) {
      this._trailPos[h] = readout.playerX;
      this._trailPos[h + 1] = readout.playerY;
      this._trailPos[h + 2] = readout.playerZ - 0.2;
    }
    const attr = this._trail.geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.needsUpdate = true;
    (this._trail.material as THREE.PointsMaterial).size = 0.1 + readout.intensity * 0.08;
    this._trail.visible = this._player.visible;
  }

  private _layoutStreaks(readout: SimReadout, dt: number): void {
    const mat = this._streaks.material as THREE.LineBasicMaterial;
    mat.opacity = Math.max(0, (readout.speedMul - 1.2) * 0.35);
    if (mat.opacity <= 0.01) return;
    for (let i = 0; i < STREAK_COUNT; i++) {
      const b = i * 6;
      this._streakPos[b + 2] -= this._scrollSpeed(readout) * dt * 1.8;
      this._streakPos[b + 5] -= this._scrollSpeed(readout) * dt * 1.8;
      if (this._streakPos[b + 2] < -8) {
        const x = (Math.random() - 0.5) * readout.halfWidth * 2;
        const y = 0.3 + Math.random() * 3.4;
        const z = 20 + Math.random() * 70;
        const len = 1.2 + Math.random() * 2.4 * readout.speedMul;
        this._streakPos[b] = x;
        this._streakPos[b + 1] = y;
        this._streakPos[b + 2] = z;
        this._streakPos[b + 3] = x;
        this._streakPos[b + 4] = y;
        this._streakPos[b + 5] = z - len;
      }
    }
    (this._streaks.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }

  private _layoutDust(readout: SimReadout, dt: number): void {
    for (let i = 0; i < DUST_COUNT; i++) {
      const z = i * 3 + 2;
      this._dustPos[z] -= this._scrollSpeed(readout) * dt * 0.45;
      if (this._dustPos[z] < -6) this._dustPos[z] = 100 + Math.random() * 20;
    }
    (this._dust.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (this._dust.material as THREE.PointsMaterial).opacity = 0.22 + readout.intensity * 0.45;
  }

  private _makeBuffer(data: Float32Array): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data, 3));
    return g;
  }

  private _track(...objs: Array<{ dispose(): void }>): void {
    this._disposables.push(...objs);
  }
}
