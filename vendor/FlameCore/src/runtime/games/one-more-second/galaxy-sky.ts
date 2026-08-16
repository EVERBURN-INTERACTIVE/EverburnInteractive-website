import * as THREE from 'three';

const STAR_COUNT_HIGH = 1600;
const STAR_COUNT_LOW = 420;
const NEBULA_RADIUS = 148;
const STAR_RADIUS = 136;
const WISP_RADIUS = 142;

export type OmsViewQuality = 'high' | 'low';

const _scratch = new THREE.Vector3();

function hash2(i: number, salt: number): number {
  const n = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Animated galaxy dome for One More Second. Shader nebula plus twinkling
 * stars, independent of corridor fog so the void beyond the lane stays alive.
 */
export class OneMoreSecondGalaxySky {
  readonly root = new THREE.Group();
  private readonly _nebulaMat: THREE.ShaderMaterial;
  private readonly _wispMat: THREE.ShaderMaterial | undefined;
  private readonly _starMat: THREE.ShaderMaterial;
  private readonly _disposables: Array<{ dispose(): void }> = [];
  private _time = 0;

  constructor(quality: OmsViewQuality = 'high') {
    this.root.name = 'OneMoreSecondGalaxy';
    const low = quality === 'low';
    const nebulaSeg = low ? 24 : 48;
    const nebulaRings = low ? 16 : 32;

    this._nebulaMat = createNebulaMaterial(1);
    const nebulaGeo = new THREE.SphereGeometry(NEBULA_RADIUS, nebulaSeg, nebulaRings);
    const nebula = new THREE.Mesh(nebulaGeo, this._nebulaMat);
    nebula.renderOrder = -20;
    nebula.frustumCulled = false;
    this.root.add(nebula);

    if (!low) {
      this._wispMat = createNebulaMaterial(2);
      const wispGeo = new THREE.SphereGeometry(WISP_RADIUS, 40, 24);
      const wisps = new THREE.Mesh(wispGeo, this._wispMat);
      wisps.renderOrder = -19;
      wisps.frustumCulled = false;
      this.root.add(wisps);
      this._disposables.push(wispGeo, this._wispMat);
    }

    const starGeo = this._makeStarGeometry(low ? STAR_COUNT_LOW : STAR_COUNT_HIGH);
    this._starMat = createStarMaterial();
    const stars = new THREE.Points(starGeo, this._starMat);
    stars.renderOrder = -18;
    stars.frustumCulled = false;
    this.root.add(stars);

    this._disposables.push(nebulaGeo, this._nebulaMat, starGeo, this._starMat);
  }

  sync(dt: number, speedMul: number): void {
    this._time += dt;
    const drift = 0.01 + Math.min(0.04, (speedMul - 1) * 0.02);
    this.root.rotation.y += dt * drift;
    this.root.rotation.z = Math.sin(this._time * 0.07) * 0.12;
    this.root.rotation.x = Math.cos(this._time * 0.045) * 0.06;
    this._nebulaMat.uniforms.time.value = this._time;
    if (this._wispMat) {
      this._wispMat.uniforms.time.value = this._time * 1.18;
    }
    this._starMat.uniforms.time.value = this._time;
  }

  dispose(): void {
    this.root.removeFromParent();
    for (const d of this._disposables) d.dispose();
    this._disposables.length = 0;
  }

  private _makeStarGeometry(starCount: number): THREE.BufferGeometry {
    const positions = new Float32Array(starCount * 3);
    const seeds = new Float32Array(starCount);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);
    const warm = new THREE.Color(0xffe7c2);
    const cool = new THREE.Color(0xa8e7ff);
    const hot = new THREE.Color(0xff9ad4);

    for (let i = 0; i < starCount; i++) {
      const u = hash2(i, 1);
      const v = hash2(i, 2);
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      _scratch.setFromSphericalCoords(STAR_RADIUS, phi, theta);
      positions[i * 3] = _scratch.x;
      positions[i * 3 + 1] = _scratch.y;
      positions[i * 3 + 2] = _scratch.z;
      seeds[i] = hash2(i, 3);
      sizes[i] = 0.9 + hash2(i, 4) * 2.4;
      const tint = hash2(i, 5);
      const c = tint < 0.55 ? cool : tint < 0.82 ? warm : hot;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    return geo;
  }
}

function createNebulaMaterial(layer: 1 | 2): THREE.ShaderMaterial {
  const inner = layer === 1 ? new THREE.Color(0x3a1078) : new THREE.Color(0x08142a);
  const mid = layer === 1 ? new THREE.Color(0x1a6bff) : new THREE.Color(0xff4d9a);
  const outer = layer === 1 ? new THREE.Color(0x5ce1ff) : new THREE.Color(0xffc56a);
  const dust = layer === 1 ? new THREE.Color(0x050314) : new THREE.Color(0x14061c);

  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      layer: { value: layer },
      colorInner: { value: inner },
      colorMid: { value: mid },
      colorOuter: { value: outer },
      colorDust: { value: dust },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float time;
      uniform float layer;
      uniform vec3 colorInner;
      uniform vec3 colorMid;
      uniform vec3 colorOuter;
      uniform vec3 colorDust;
      varying vec3 vDir;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.23));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(
            mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
            f.y
          ),
          mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
            f.y
          ),
          f.z
        );
      }

      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.52;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = p * 2.07 + vec3(0.17, 0.09, 0.23);
          a *= 0.5;
        }
        return v;
      }

      vec3 rotateY(vec3 p, float a) {
        float c = cos(a);
        float s = sin(a);
        return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
      }

      vec3 rotateX(vec3 p, float a) {
        float c = cos(a);
        float s = sin(a);
        return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
      }

      void main() {
        vec3 dir = normalize(vDir);
        float t = time * (0.045 + layer * 0.012);
        vec3 p = rotateY(rotateX(dir, t * 0.35), t);
        vec3 q = rotateY(dir * 1.7 + vec3(2.1, 0.4, -1.2), -t * 1.4);

        float n1 = fbm(p * 2.4 + vec3(time * 0.07, 0.0, -time * 0.04));
        float n2 = fbm(q * 3.1 + vec3(-time * 0.05, time * 0.03, 0.8));
        float lanes = smoothstep(0.42, 0.72, fbm(p * 1.15 + n2));
        float density = smoothstep(0.28, 0.78, n1 * 0.65 + n2 * 0.55);
        density *= mix(0.45, 1.0, lanes);

        float lobe = pow(max(0.0, dot(dir, normalize(vec3(0.35, 0.15, 0.9)))), 3.0);
        float lobe2 = pow(max(0.0, dot(dir, normalize(vec3(-0.7, 0.4, -0.2)))), 4.0);
        density = clamp(density + lobe * 0.35 + lobe2 * 0.22, 0.0, 1.0);

        vec3 col = mix(colorDust, colorInner, density);
        col = mix(col, colorMid, smoothstep(0.4, 0.85, n2) * density);
        col = mix(col, colorOuter, pow(density, 2.4) * (0.35 + 0.65 * lobe));

        float twinkle = 0.92 + 0.08 * sin(time * 0.6 + n1 * 8.0);
        float alpha = layer < 1.5 ? 1.0 : density * 0.55 * twinkle;
        if (layer < 1.5) {
          col *= twinkle;
          float vignette = 0.55 + 0.45 * density;
          col *= vignette;
        }
        gl_FragColor = vec4(col, alpha);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: true,
    fog: false,
    toneMapped: true,
    transparent: layer === 2,
    blending: layer === 2 ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

function createStarMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      attribute float aSize;
      attribute vec3 aColor;
      uniform float time;
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vColor = aColor;
        float pulse = 0.55 + 0.45 * sin(time * (1.2 + aSeed * 3.4) + aSeed * 14.0);
        vTwinkle = pulse;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * pulse * (220.0 / max(1.0, -mv.z));
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float d = dot(uv, uv);
        if (d > 1.0) discard;
        float core = smoothstep(1.0, 0.0, d);
        float spike = pow(max(0.0, 1.0 - abs(uv.x) * 8.0), 2.0) * pow(max(0.0, 1.0 - abs(uv.y) * 1.6), 2.0);
        float a = core * core + spike * 0.35;
        gl_FragColor = vec4(vColor * (0.7 + 0.6 * vTwinkle), a);
      }
    `,
    transparent: true,
    depthWrite: false,
    fog: false,
    blending: THREE.AdditiveBlending,
  });
}
