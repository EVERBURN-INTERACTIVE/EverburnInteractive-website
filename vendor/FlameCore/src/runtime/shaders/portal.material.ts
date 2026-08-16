import * as THREE from 'three';

/** Swirling portal disc material. */
export function createPortalMaterial(options?: {
  colorInner?: THREE.Color;
  colorOuter?: THREE.Color;
  speed?: number;
  noiseScale?: number;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      colorInner: { value: options?.colorInner ?? new THREE.Color(0x8800ff) },
      colorOuter: { value: options?.colorOuter ?? new THREE.Color(0x00cccc) },
      time: { value: 0.0 },
      speed: { value: options?.speed ?? 1.0 },
      noiseScale: { value: options?.noiseScale ?? 3.0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3  colorInner;
      uniform vec3  colorOuter;
      uniform float time;
      uniform float speed;
      uniform float noiseScale;
      varying vec2  vUv;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv - 0.5;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);
        float swirl = angle + time * speed + dist * noiseScale;
        float n = noise(vec2(swirl * 0.5, dist * 3.0));
        float ring = smoothstep(0.45, 0.5, dist) * smoothstep(0.55, 0.5, dist);
        float vortex = smoothstep(0.4, 0.0, dist) * (0.5 + 0.5 * sin(swirl * 6.0 + n));
        vec3 col = mix(colorInner, colorOuter, dist * 2.0);
        float alpha = (ring * 0.8 + vortex * 0.9) * smoothstep(0.55, 0.4, dist);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
