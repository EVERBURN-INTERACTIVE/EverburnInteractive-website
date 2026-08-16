import * as THREE from 'three';

/** Sci-fi hologram surface material. */
export function createHologramMaterial(options?: {
  color?: THREE.Color;
  scanlineSpeed?: number;
  flickerSpeed?: number;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: options?.color ?? new THREE.Color(0x00ffff) },
      time: { value: 0.0 },
      scanlineSpeed: { value: options?.scanlineSpeed ?? 1.0 },
      flickerSpeed: { value: options?.flickerSpeed ?? 3.0 },
      opacity: { value: 1.0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-worldPos.xyz);
        gl_Position = projectionMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3  color;
      uniform float time;
      uniform float scanlineSpeed;
      uniform float flickerSpeed;
      uniform float opacity;
      varying vec2  vUv;
      varying vec3  vNormal;
      varying vec3  vViewDir;

      void main() {
        float scan = step(0.5, fract(vUv.y * 80.0 - time * scanlineSpeed));
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.0);
        float flicker = 0.85 + 0.15 * sin(time * flickerSpeed * 6.28);
        float alpha = (0.3 + 0.3 * scan + 0.4 * fresnel) * flicker * opacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
