import * as THREE from 'three';

/** Glitch post-process style material with RGB channel split. */
export function createGlitchMaterial(map?: THREE.Texture | null): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map ?? null },
      glitchIntensity: { value: 0.0 },
      time: { value: 0.0 },
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
      uniform float glitchIntensity;
      uniform float time;
      uniform vec3 baseColor;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        float noise = rand(vec2(uv.y * 100.0, time));
        float disp = glitchIntensity * noise * 0.05;

        vec4 tex = texture2D(map, uv);
        vec3 color = tex.a > 0.001 ? tex.rgb : baseColor;

        float r = texture2D(map, uv + vec2(disp, 0.0)).r;
        float g = color.g;
        float b = texture2D(map, uv - vec2(disp, 0.0)).b;
        float a = tex.a > 0.001 ? tex.a : 1.0;

        gl_FragColor = vec4(mix(color, vec3(r, g, b), glitchIntensity), a);
      }
    `,
    transparent: true,
  });
}

/** Update glitch shader uniforms from component props. */
export function patchGlitchMaterial(
  material: THREE.ShaderMaterial,
  options: { intensity: number; time: number; map?: THREE.Texture | null; baseColor?: THREE.Color },
): void {
  material.uniforms.glitchIntensity.value = options.intensity;
  material.uniforms.time.value = options.time;
  if (options.map !== undefined) material.uniforms.map.value = options.map;
  if (options.baseColor) material.uniforms.baseColor.value = options.baseColor;
}
