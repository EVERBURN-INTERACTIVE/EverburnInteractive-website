import * as THREE from 'three';

/** Hex-grid energy shield material. */
export function createEnergyShieldMaterial(options?: {
  color?: THREE.Color;
  pulseSpeed?: number;
  hexScale?: number;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: options?.color ?? new THREE.Color(0x0066ff) },
      time: { value: 0.0 },
      pulseSpeed: { value: options?.pulseSpeed ?? 2.0 },
      hexScale: { value: options?.hexScale ?? 8.0 },
      impactPos: { value: new THREE.Vector3(0, 0, 0) },
      impactTime: { value: -999.0 },
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
      uniform float pulseSpeed;
      uniform float hexScale;
      varying vec2  vUv;
      varying vec3  vNormal;
      varying vec3  vViewDir;

      float hexDist(vec2 p) {
        p = abs(p);
        return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
      }

      void main() {
        vec2 hexUv = vUv * hexScale;
        hexUv.y *= 0.866;
        vec2 gridUv = fract(hexUv) - 0.5;
        float h = hexDist(gridUv);
        float hexLine = smoothstep(0.45, 0.5, h) - smoothstep(0.5, 0.55, h);
        float pulse = 0.5 + 0.5 * sin(time * pulseSpeed * 6.28);
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
        float alpha = (hexLine * 0.6 + fresnel * 0.4) * (0.6 + 0.4 * pulse);
        gl_FragColor = vec4(color, alpha * 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
