import * as THREE from 'three';

/** Pixelated dissolve reveal material. */
export function createDissolveMaterial(map?: THREE.Texture | null): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map ?? null },
      dissolveProgress: { value: 1.0 },
      pixelSize: { value: 4.0 },
      baseColor: { value: new THREE.Color(1, 1, 1) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform float dissolveProgress;
      uniform float pixelSize;
      uniform vec3 baseColor;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 pixelatedUv = floor(vUv * pixelSize) / pixelSize;
        float threshold = rand(pixelatedUv);
        if (threshold > dissolveProgress) discard;
        vec4 tex = texture2D(map, vUv);
        vec3 color = tex.a > 0.001 ? tex.rgb : baseColor;
        float alpha = tex.a > 0.001 ? tex.a : 1.0;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/** Update dissolve shader uniforms from component props. */
export function patchDissolveMaterial(
  material: THREE.ShaderMaterial,
  options: { progress: number; map?: THREE.Texture | null; baseColor?: THREE.Color },
): void {
  material.uniforms.dissolveProgress.value = options.progress;
  if (options.map !== undefined) material.uniforms.map.value = options.map;
  if (options.baseColor) material.uniforms.baseColor.value = options.baseColor;
}
