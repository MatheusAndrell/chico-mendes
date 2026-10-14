import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Terrain, Grass, Sky, Motes, heightAt } from './World'
import { buildTree, SPECIES_PARAMS } from './treeGen'
import { makeGrowMaterial, makeUniforms } from './growMaterial'
import { mulberry32, range, smooth, easeOutBack } from './utils'

// aparelhos modestos (celular / poucos núcleos): menos grama e árvores
const LOW =
  typeof window !== 'undefined' &&
  (window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4)

/**
 * Hero: semente → germinação → árvore → floresta.
 * `progress.current` (0..1) vem do scroll.
 */
export default function HeroScene({ progress, active = true }) {
  const uniforms = useMemo(makeUniforms, [])
  return (
    <Canvas
      shadows="soft"
      dpr={LOW ? [1, 1.3] : [1, 1.6]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0.2, 0.1, 0.45], fov: 38, near: 0.01, far: 400 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#f1e6cf', 22, 95]} />
      <Clock uniforms={uniforms} progress={progress} />
      <Sky progressRef={progress} top="#a9cbd8" horizon="#eef0dc" dawn={{ top: '#e9c9a0', horizon: '#f6e4c2' }} />
      <Lights progress={progress} />
      <Terrain />
      <Grass uniforms={uniforms} count={LOW ? 3200 : 6000} />
      <Seed progress={progress} />
      <Sprout progress={progress} />
      <HeroTree uniforms={uniforms} />
      <Forest uniforms={uniforms} count={LOW ? 120 : 190} />
      <Motes />
      <CameraRig progress={progress} />
    </Canvas>
  )
}

// Atualiza uniforms a partir do progresso (com suavização)
function Clock({ uniforms, progress }) {
  const smoothP = useRef(progress.current)
  useFrame((s, dt) => {
    smoothP.current += (progress.current - smoothP.current) * (1 - Math.pow(0.002, Math.min(dt, 0.1)))
    const p = smoothP.current
    uniforms.uTime.value = s.clock.elapsedTime
    uniforms.uGrow.value = range(p, 0.33, 0.7)
    uniforms.uForest.value = range(p, 0.6, 1.0)
    uniforms.uWind.value = 0.6 + Math.sin(s.clock.elapsedTime * 0.4) * 0.25
    progress.smooth = p
  })
  return null
}

function Lights({ progress }) {
  const sun = useRef()
  const hemi = useRef()
  const warm = useMemo(() => new THREE.Color('#ffc98a'), [])
  const day = useMemo(() => new THREE.Color('#fff4e0'), [])
  useFrame(() => {
    const p = progress.smooth ?? 0
    const k = smooth(range(p, 0.2, 0.8))
    if (sun.current) {
      sun.current.color.copy(warm).lerp(day, k)
      sun.current.intensity = 2.2 + k * 0.8
      sun.current.position.set(-6 + k * 4, 3 + k * 7, 5)
    }
    if (hemi.current) hemi.current.intensity = 0.55 + k * 0.35
  })
  return (
    <>
      <hemisphereLight ref={hemi} args={['#fff6e3', '#4b6b3a', 0.6]} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
      />
    </>
  )
}

// ───────────────────────── câmera ─────────────────────────
// Quadros-chave: [progresso, posição, alvo]
const KEYS = [
  [0.0, [0.16, 0.075, 0.36], [0, 0.03, 0]],
  [0.2, [0.26, 0.15, 0.58], [0, 0.1, 0]],
  [0.34, [0.75, 0.42, 1.45], [0, 0.3, 0]],
  [0.47, [3.0, 1.7, 5.9], [0, 1.5, 0]],
  [0.7, [5.6, 3.1, 10.2], [0, 2.3, 0]],
  [1.0, [0.5, 19, 31], [0, 0.5, -2]]
]
const posCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[1])), false, 'centripetal')
const lookCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[2])), false, 'centripetal')
function curveParam(p) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i][0]
    const b = KEYS[i + 1][0]
    if (p <= b) return (i + smooth(range(p, a, b))) / (KEYS.length - 1)
  }
  return 1
}

function CameraRig({ progress }) {
  const { camera, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const ptr = useRef({ x: 0, y: 0 })

  useEffect(() => {
    camera.fov = size.width / size.height < 1 ? 54 : 40
    camera.updateProjectionMatrix()
  }, [camera, size])

  useFrame((s, dt) => {
    const p = progress.smooth ?? 0
    const u = curveParam(p)
    posCurve.getPoint(u, pos)
    lookCurve.getPoint(u, look)
    // órbita lenta + paralaxe do ponteiro
    const dist = pos.length()
    ptr.current.x += (s.pointer.x - ptr.current.x) * 0.04
    ptr.current.y += (s.pointer.y - ptr.current.y) * 0.04
    const orbit = Math.sin(s.clock.elapsedTime * 0.12) * 0.06 + ptr.current.x * 0.08
    pos.applyAxisAngle(THREE.Object3D.DEFAULT_UP, orbit)
    pos.y += ptr.current.y * dist * 0.02
    const floor = heightAt(pos.x, pos.z) + 0.04
    if (pos.y < floor) pos.y = floor
    camera.position.lerp(pos, 1 - Math.pow(0.0005, Math.min(dt, 0.1)))
    camera.lookAt(look)
  })
  return null
}

// ───────────────────────── semente ─────────────────────────
function Seed({ progress }) {
  const group = useRef()
  const body = useRef()
  const top = useRef()
  const bottom = useRef()
  const root = useRef()
  useFrame((s) => {
    const p = progress.smooth ?? 0
    if (!group.current) return
    const open = smooth(range(p, 0.07, 0.17))
    const gone = range(p, 0.3, 0.4)
    group.current.visible = gone < 1
    group.current.scale.setScalar(Math.max(0.001, 1 - gone))
    const breath = 1 + Math.sin(s.clock.elapsedTime * 2.2) * 0.025 * (1 - open)
    body.current.scale.setScalar(breath)
    top.current.rotation.z = open * 1.1
    top.current.position.set(-open * 0.012, open * 0.01, 0)
    bottom.current.rotation.z = -open * 0.35
    root.current.scale.set(1, Math.max(0.001, smooth(range(p, 0.08, 0.22))), 1)
  })
  return (
    <group ref={group} position={[0.012, 0.012, 0]} rotation={[0.2, 0.5, 0.15]}>
      <group ref={body}>
        <mesh ref={top} castShadow scale={[0.034, 0.02, 0.024]}>
          <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#7a4a26" roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={bottom} castShadow scale={[0.034, 0.02, 0.024]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#6a3e1f" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh scale={[0.028, 0.014, 0.019]}>
          <sphereGeometry args={[1, 16, 10]} />
          <meshStandardMaterial color="#e9dcb6" roughness={0.7} />
        </mesh>
      </group>
      {/* radícula indo para o solo */}
      <mesh ref={root} position={[0.02, -0.004, 0]} rotation={[0, 0, -2.2]}>
        <cylinderGeometry args={[0.0015, 0.004, 0.05, 6]} />
        <meshStandardMaterial color="#efe3c3" roughness={0.6} />
      </mesh>
    </group>
  )
}

// ───────────────────────── broto ─────────────────────────
// O caule nasce dobrado (o "gancho" da germinação) e se endireita ao crescer.
function leafShape(w, h, cup) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(w * 0.75, h * 0.15, w, h * 0.65, 0, h)
  s.bezierCurveTo(-w, h * 0.65, -w * 0.75, h * 0.15, 0, 0)
  const g = new THREE.ShapeGeometry(s, 10)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.pow(Math.abs(p.getX(i)) / w, 2) * cup)
  g.computeVertexNormals()
  return g
}
const cotyledon = leafShape(0.022, 0.046, 0.006)
const trueLeaf = leafShape(0.028, 0.09, 0.01)

function Sprout({ progress }) {
  const group = useRef()
  const stem = useRef()
  const cots = [useRef(), useRef()]
  const leaves = [useRef(), useRef()]
  const last = useRef(-1)
  const curve = useMemo(() => new THREE.CatmullRomCurve3([0, 1, 2, 3, 4].map(() => new THREE.Vector3())), [])
  const tip = useMemo(() => new THREE.Vector3(), [])

  useFrame((s) => {
    const p = progress.smooth ?? 0
    if (!group.current) return
    const grow = smooth(range(p, 0.1, 0.32))
    const straight = smooth(range(p, 0.17, 0.3))
    const fade = smooth(range(p, 0.36, 0.46))
    group.current.visible = grow > 0.002 && fade < 1
    if (!group.current.visible) return
    group.current.scale.setScalar(1 - fade * 0.9)

    if (Math.abs(p - last.current) > 0.0004) {
      last.current = p
      const H = 0.03 + grow * 0.27
      const hook = 1 - straight
      const pts = curve.points
      pts[0].set(0, 0, 0)
      pts[1].set(0.004, H * 0.3, 0)
      pts[2].set(0.002, H * 0.62, 0)
      pts[3].set(0.012 * hook + 0.003, H * (0.92 - 0.12 * hook), 0)
      pts[4].set(0.03 * hook + 0.002, H * (1 - 0.32 * hook), 0)
      curve.updateArcLengths()
      const old = stem.current.geometry
      stem.current.geometry = new THREE.TubeGeometry(curve, 24, 0.0042, 7, false)
      old.dispose()
    }
    curve.getPoint(1, tip)
    const unfold = smooth(range(p, 0.22, 0.32))
    const flutter = Math.sin(s.clock.elapsedTime * 2.1) * 0.05
    cots.forEach((r, i) => {
      const m = r.current
      const sign = i ? -1 : 1
      m.position.copy(tip)
      m.rotation.set(0, i ? Math.PI : 0, sign * (0.15 + unfold * 1.05) - (1 - straight) * 1.6 + flutter * sign)
      m.scale.setScalar(0.6 + unfold * 0.6)
    })
    const tl = easeOutBack(range(p, 0.27, 0.37))
    leaves.forEach((r, i) => {
      const m = r.current
      m.position.copy(tip)
      m.rotation.set(0.3, Math.PI / 2 + (i ? Math.PI : 0), (i ? -1 : 1) * 0.5 + flutter * 0.6)
      m.scale.setScalar(Math.max(0.001, tl))
    })
  })

  return (
    <group ref={group} visible={false}>
      <mesh ref={stem} castShadow>
        <bufferGeometry />
        <meshStandardMaterial color="#9cc46a" roughness={0.6} />
      </mesh>
      {cots.map((r, i) => (
        <mesh key={'c' + i} ref={r} geometry={cotyledon} castShadow>
          <meshStandardMaterial color={i ? '#9bc75f' : '#a8cf6a'} roughness={0.55} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {leaves.map((r, i) => (
        <mesh key={'l' + i} ref={r} geometry={trueLeaf} castShadow>
          <meshStandardMaterial color={i ? '#6aa645' : '#5e9a3e'} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// ───────────────────────── a árvore (ipê) ─────────────────────────
function HeroTree({ uniforms }) {
  const { geometry, material, depthMaterial } = useMemo(() => {
    const geometry = buildTree(SPECIES_PARAMS.ipe, { seed: 4, lod: 1, scale: 1.1 })
    return { geometry, ...makeGrowMaterial({ uniforms }) }
  }, [uniforms])
  return (
    <mesh
      geometry={geometry}
      material={material}
      customDepthMaterial={depthMaterial}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  )
}

// ───────────────────────── floresta ─────────────────────────
// Várias espécies, cada uma num InstancedMesh; as árvores brotam do centro para fora.
const FOREST_MIX = [
  ['cabucu', 0.3],
  ['jequitiba', 0.22],
  ['paubrasil', 0.16],
  ['araucaria', 0.12],
  ['ipe', 0.1],
  ['quaresmeira', 0.1]
]
function Forest({ uniforms, count = 190 }) {
  const groups = useMemo(() => {
    const r = mulberry32(21)
    const spots = []
    let tries = 0
    while (spots.length < count && tries < 8000) {
      tries++
      const a = r() * Math.PI * 2
      const d = 2.6 + Math.pow(r(), 0.85) * 24
      const x = Math.cos(a) * d
      const z = Math.sin(a) * d
      // corredor livre na frente da câmera final
      if (z > 9 && Math.abs(x) < 9 + (z - 9) * 0.4) continue
      // e ao longo do caminho que a câmera percorre ao se afastar
      {
        const ax = 5.6, az = 10.2, bx = 0.5, bz = 31
        const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / ((bx - ax) ** 2 + (bz - az) ** 2)))
        if (Math.hypot(x - (ax + (bx - ax) * t), z - (az + (bz - az) * t)) < 5) continue
      }
      const minGap = 0.9 + d * 0.035
      if (spots.some((s) => (s.x - x) ** 2 + (s.z - z) ** 2 < minGap * minGap)) continue
      spots.push({ x, z, d, s: 0.75 + r() * 0.55, rot: r() * 6.28 })
    }
    const bySp = Object.fromEntries(FOREST_MIX.map(([k]) => [k, []]))
    spots.forEach((s) => {
      let t = r()
      for (const [k, w] of FOREST_MIX) {
        if ((t -= w) <= 0) return bySp[k].push(s)
      }
      bySp.cabucu.push(s)
    })
    return FOREST_MIX.map(([k], i) => {
      const list = bySp[k]
      const geometry = buildTree(SPECIES_PARAMS[k], { seed: 30 + i, lod: 0.5, scale: 1 })
      const delay = new Float32Array(list.length)
      const speed = new Float32Array(list.length)
      list.forEach((s, j) => {
        delay[j] = ((s.d - 2.6) / 24) * 0.62 + r() * 0.06
        speed[j] = 2.4 + r() * 0.8
      })
      geometry.setAttribute('aDelay', new THREE.InstancedBufferAttribute(delay, 1))
      geometry.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speed, 1))
      return { key: k, list, geometry, ...makeGrowMaterial({ uniforms, instanced: true }) }
    }).filter((g) => g.list.length)
  }, [uniforms, count])

  return groups.map((g) => (
    <instancedMesh
      key={g.key}
      args={[g.geometry, g.material, g.list.length]}
      receiveShadow
      frustumCulled={false}
      ref={(m) => {
        if (!m || m.userData.ready) return
        const o = new THREE.Object3D()
        g.list.forEach((s, j) => {
          o.position.set(s.x, heightAt(s.x, s.z) - 0.02, s.z)
          o.rotation.set(0, s.rot, 0)
          o.scale.setScalar(s.s)
          o.updateMatrix()
          m.setMatrixAt(j, o.matrix)
        })
        m.instanceMatrix.needsUpdate = true
        m.userData.ready = true
      }}
    />
  ))
}
