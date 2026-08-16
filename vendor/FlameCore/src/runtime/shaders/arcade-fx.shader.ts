import * as THREE from 'three';

/**
 * Full-screen arcade pass: chromatic aberration, vignette, scanlines,
 * block glitch, invert (rewind), and white flash.
 */
export const ArcadeFxShader: {
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
  fragmentShader: string;
} = {
  uniforms: {
    tDiffuse: { value: null },
    chromaticAberration: { value: 0 },
    vignette: { value: 0 },
    scanline: { value: 0 },
    glitch: { value: 0 },
    invert: { value: 0 },
    flash: { value: 0 },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float chromaticAberration;
    uniform float vignette;
    uniform float scanline;
    uniform float glitch;
    uniform float invert;
    uniform float flash;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      float g = glitch;
      if (g > 0.001) {
        float band = step(0.92, rand(vec2(floor(uv.y * 28.0), floor(time * 18.0))));
        uv.x += band * (rand(vec2(time, uv.y)) - 0.5) * 0.08 * g;
      }
      float ca = chromaticAberration * 0.012;
      float r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
      float ga = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;
      vec3 color = vec3(r, ga, b);

      float d = distance(vUv, vec2(0.5));
      color *= 1.0 - vignette * d * d * 1.6;

      float sl = sin((vUv.y + time * 0.04) * resolution.y * 1.4);
      color *= 1.0 - scanline * 0.08 * sl * sl;

      if (g > 0.2) {
        float slice = rand(vec2(floor(uv.y * 12.0), floor(time * 9.0)));
        if (slice > 0.85) color.rb = color.br;
      }

      color = mix(color, 1.0 - color, clamp(invert, 0.0, 1.0));
      color += vec3(flash);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

/** True when any arcade uniform would be visible. */
export function arcadeFxActive(params: {
  chromaticAberration: number;
  vignette: number;
  scanline: number;
  glitch: number;
  invert: number;
  flash: number;
}): boolean {
  return (
    params.chromaticAberration > 0.002 ||
    params.vignette > 0.002 ||
    params.scanline > 0.002 ||
    params.glitch > 0.002 ||
    params.invert > 0.002 ||
    params.flash > 0.002
  );
}
