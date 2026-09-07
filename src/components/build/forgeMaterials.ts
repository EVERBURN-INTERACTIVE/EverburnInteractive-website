import { ShaderMaterial } from 'three';

const NOISE_GLSL = `
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.07;
    amplitude *= 0.5;
  }
  return value;
}
`;

export function createLavaMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uHeat: { value: 0.25 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorld;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uHeat;
      varying vec2 vUv;
      varying vec3 vWorld;
      ${NOISE_GLSL}
      void main() {
        vec2 uv = vUv * 5.5;
        float warp = fbm(uv + uTime * 0.07);
        float cracks = smoothstep(0.38, 0.78, fbm(uv * 2.1 + warp * 1.4));
        float pulse = 0.7 + 0.3 * sin(uTime * 1.6 + cracks * 8.0);
        vec3 obsidian = vec3(0.028, 0.018, 0.014);
        vec3 magma = vec3(1.0, 0.27, 0.04);
        vec3 core = vec3(1.0, 0.78, 0.32);
        vec3 color = mix(obsidian, magma, cracks * (0.28 + uHeat * 0.82) * pulse);
        color = mix(color, core, cracks * cracks * uHeat * 0.65);
        float dist = length(vUv - 0.5);
        float hearth = 1.0 - smoothstep(0.0, 0.18, dist);
        color = mix(color, mix(magma, core, 0.55), hearth * (0.72 + uHeat * 0.28));
        float rim = 1.0 - smoothstep(0.42, 0.5, length(vUv - 0.5));
        float spec = pow(max(0.0, 1.0 - cracks), 6.0) * 0.08;
        if (rim < 0.01) discard;
        gl_FragColor = vec4(color * rim + spec, rim);
      }
    `,
  });
}
