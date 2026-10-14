import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mulberry32 } from './utils'

// ───────────────────────── terreno ─────────────────────────
// Plano no centro (onde a semente cai), colinas suaves e a serra ao fundo.
export function heightAt(x, z) {
  const d = Math.hypot(x, z)
  const n =
    Math.sin(x * 0.21 + 1.3) * Math.cos(z * 0.18) * 0.55 +
    Math.sin(x * 0.53 + z * 0.41) * 0.18 +
    Math.cos(x * 0.09 - z * 0.13) * 0.9
  const flat = THREE.MathUtils.smoothstep(d, 1.2, 9)
  const serra = Math.pow(THREE.MathUtils.smoothstep(d, 26, 60), 1.4) * (9 + Math.sin(Math.atan2(z, x) * 5) * 3 + Math.sin(Math.atan2(z, x) * 11) * 1.4)
  return n * flat * 0.6 + serra - 0.02
}

export function Terrain({ radius = 70 }) {
  const geometry = useMemo(() => {
    const g = new THREE.RingGeometry(0.001, radius, 128, 70)
    // malha mais densa no centro: redistribui raios
    const pos = g.attributes.position
    const colors = []
    const r = mulberry32(11)
    const grassA = new THREE.Color('#6d9b4a')
    const grassB = new THREE.Color('#4f7f3a')
    const soil = new THREE.Color('#7a5638')
    const far = new THREE.Color('#3d6544')
    const c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i)
      let y = pos.getY(i)
      const d0 = Math.hypot(x, y)
      // aproxima vértices do centro (mais detalhe perto da câmera)
      const k = d0 > 0 ? Math.pow(d0 / radius, 1.8) * radius / d0 : 0
      x *= k
      y *= k
      const z = -y
      pos.setXYZ(i, x, heightAt(x, z), z)
      const d = Math.hypot(x, z)
      c.copy(grassA).lerp(grassB, r() * 0.6)
      c.lerp(soil, (1 - THREE.MathUtils.smoothstep(d, 0.18, 0.6)) * (0.85 + r() * 0.15))
      c.lerp(far, THREE.MathUtils.smoothstep(d, 14, 40))
      colors.push(c.r, c.g, c.b)
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [radius])
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  )
}

// ───────────────────────── grama com vento ─────────────────────────
export function Grass({ count = 5000, radius = 9, inner = 0.55, uniforms }) {
  const ref = useRef()
  const { geometry, material } = useMemo(() => {
    // lâmina: 3 segmentos afinando
    const g = new THREE.BufferGeometry()
    const w = 0.012
    const verts = [-w, 0, 0, w, 0, 0, -w * 0.75, 0.33, 0, w * 0.75, 0.33, 0, -w * 0.4, 0.66, 0, w * 0.4, 0.66, 0, 0, 1, 0]
    const ys = [0, 0, 0.33, 0.33, 0.66, 0.66, 1]
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    g.setAttribute('aY', new THREE.Float32BufferAttribute(ys, 1))
    g.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6])
    g.computeVertexNormals()
    const m = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.9 })
    m.onBeforeCompile = (s) => {
      s.uniforms.uTime = uniforms.uTime
      s.vertexShader =
        'uniform float uTime; attribute float aY; varying float vY;\n' +
        s.vertexShader
          .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3(0.0, 1.0, 0.0);')
          .replace(
            '#include <project_vertex>',
            `vec4 mvPosition = instanceMatrix * vec4(transformed, 1.0);
             float ph = mvPosition.x * 1.7 + mvPosition.z * 1.3;
             float bend = aY * aY;
             mvPosition.x += (sin(uTime * 1.6 + ph) * 0.05 + sin(uTime * 4.1 + ph * 3.0) * 0.012) * bend;
             mvPosition.z += cos(uTime * 1.3 + ph) * 0.035 * bend;
             vY = aY;
             mvPosition = modelViewMatrix * mvPosition;
             gl_Position = projectionMatrix * mvPosition;`
          )
      s.fragmentShader = 'varying float vY;\n' + s.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
         diffuseColor.rgb *= mix(0.45, 1.15, vY);`
      )
    }
    return { geometry: g, material: m }
  }, [uniforms])

  const data = useMemo(() => {
    const r = mulberry32(5)
    const dummy = new THREE.Object3D()
    const mats = []
    const cols = []
    const greens = ['#7fae52', '#6a9c45', '#8fbd5e', '#5d8f3d', '#a3c56a'].map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2
      const d = inner + Math.pow(r(), 1.7) * (radius - inner)
      const x = Math.cos(a) * d
      const z = Math.sin(a) * d
      dummy.position.set(x, heightAt(x, z), z)
      dummy.rotation.set((r() - 0.5) * 0.35, r() * Math.PI, (r() - 0.5) * 0.35)
      const h = (0.07 + r() * 0.12) * (0.6 + d / radius)
      dummy.scale.set(1 + r(), h, 1)
      dummy.updateMatrix()
      mats.push(dummy.matrix.clone())
      cols.push(greens[Math.floor(r() * greens.length)])
    }
    return { mats, cols }
  }, [count, radius, inner])

  return (
    <instancedMesh
      ref={(m) => {
        ref.current = m
        if (m && !m.userData.ready) {
          data.mats.forEach((mx, i) => {
            m.setMatrixAt(i, mx)
            m.setColorAt(i, data.cols[i])
          })
          m.instanceMatrix.needsUpdate = true
          if (m.instanceColor) m.instanceColor.needsUpdate = true
          m.userData.ready = true
        }
      }}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  )
}

// ───────────────────────── céu ─────────────────────────
export function Sky({ top = '#9cc3d6', horizon = '#f1e6cf', bottom = '#e9dcc0', progressRef, dawn }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color(top) },
          uHorizon: { value: new THREE.Color(horizon) },
          uBottom: { value: new THREE.Color(bottom) }
        },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uBottom; varying vec3 vP;
          void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(uHorizon, uTop, pow(smoothstep(0.0, 0.6, h), 0.8)) : mix(uHorizon, uBottom, smoothstep(0.0, -0.2, h));
          gl_FragColor = vec4(c, 1.0); }`
      }),
    [top, horizon, bottom]
  )
  const day = useMemo(() => ({ top: new THREE.Color(top), hz: new THREE.Color(horizon) }), [top, horizon])
  const dawnC = useMemo(() => dawn && { top: new THREE.Color(dawn.top), hz: new THREE.Color(dawn.horizon) }, [dawn])
  const { scene } = useThree()
  useFrame(() => {
    if (!dawnC || !progressRef) return
    const k = THREE.MathUtils.smoothstep(progressRef.current, 0.25, 0.85)
    mat.uniforms.uTop.value.copy(dawnC.top).lerp(day.top, k)
    mat.uniforms.uHorizon.value.copy(dawnC.hz).lerp(day.hz, k)
    if (scene.fog) scene.fog.color.copy(mat.uniforms.uHorizon.value)
  })
  return (
    <mesh material={mat} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[150, 32, 16]} />
    </mesh>
  )
}

/** Motas de luz/pólen flutuando */
export function Motes({ count = 160, area = 14, height = 4, color = '#fff3c4', opacity = 0.7 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const r = mulberry32(9)
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (r() - 0.5) * area
      a[i * 3 + 1] = 0.1 + r() * height
      a[i * 3 + 2] = (r() - 0.5) * area
    }
    return a
  }, [count, area, height])
  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.y = s.clock.elapsedTime * 0.015
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.35) * 0.08
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={color} transparent opacity={opacity} depthWrite={false} sizeAttenuation />
    </points>
  )
}
