import * as THREE from 'three'

/**
 * Material de crescimento + vento.
 *
 * A geometria traz, por vértice:
 *   aBase  – ponto de onde aquele pedaço "nasce" (início do galho / centro da folha)
 *   aBirth – momento (0..1) em que começa a crescer
 *   aDur   – quanto tempo leva para crescer
 *
 * uGrow (0..1) controla o crescimento da árvore inteira. Em InstancedMesh,
 * o atributo por instância aDelay atrasa cada árvore em relação a uForest.
 */
export function makeGrowMaterial({ uniforms, instanced = false, side = THREE.DoubleSide } = {}) {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0, side })
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side })

  const patch = (shader) => {
    shader.uniforms.uGrow = uniforms.uGrow
    shader.uniforms.uTime = uniforms.uTime
    shader.uniforms.uWind = uniforms.uWind
    if (instanced) shader.uniforms.uForest = uniforms.uForest

    shader.vertexShader =
      /* glsl */ `
      uniform float uGrow;
      uniform float uTime;
      uniform float uWind;
      ${instanced ? 'uniform float uForest; attribute float aDelay; attribute float aSpeed;' : ''}
      attribute vec3 aBase;
      attribute vec3 aCenter;
      attribute float aBark;
      attribute float aBirth;
      attribute float aDur;
      ` +
      shader.vertexShader
        .replace(
          '#include <begin_vertex>',
          /* glsl */ `
          float grow = ${instanced ? 'clamp((uForest - aDelay) * aSpeed, 0.0, 1.0)' : 'uGrow'};
          float g = clamp((grow - aBirth) / aDur, 0.0, 1.0);
          g = g * g * (3.0 - 2.0 * g);
          // galhos engrossam ao longo da vida da árvore (aBark = 1); folhas não
          float thick = mix(1.0, mix(0.07, 1.0, smoothstep(0.0, 0.85, grow)), aBark);
          vec3 c = aBase + (aCenter - aBase) * g;
          vec3 transformed = c + (position - aCenter) * g * thick;
          `
        )
        .replace(
          '#include <project_vertex>',
          /* glsl */ `
          vec4 mvPosition = vec4(transformed, 1.0);
          float baseY = 0.0;
          #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            baseY = instanceMatrix[3].y;
          #endif
          float h = max(0.0, mvPosition.y - baseY);
          float sway = uWind * h * h * 0.006;
          float ph = mvPosition.x * 0.31 + mvPosition.z * 0.27;
          mvPosition.x += sin(uTime * 1.15 + ph) * sway + sin(uTime * 3.7 + ph * 4.0 + h) * sway * 0.25;
          mvPosition.z += cos(uTime * 0.93 + ph) * sway * 0.7;
          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;
          `
        )
  }

  mat.onBeforeCompile = (shader) => {
    patch(shader)
    // folhagem dupla-face: não inverter a normal no verso (evita manchas escuras)
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', '')
    )
    // leve translucidez: folhas contra a luz ficam mais vivas
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * 0.08;'
    )
  }
  depth.onBeforeCompile = patch
  mat.customProgramCacheKey = () => 'grow' + instanced
  depth.customProgramCacheKey = () => 'growd' + instanced
  return { material: mat, depthMaterial: depth }
}

export function makeUniforms() {
  return {
    uGrow: { value: 0 },
    uTime: { value: 0 },
    uWind: { value: 1 },
    uForest: { value: 0 }
  }
}
