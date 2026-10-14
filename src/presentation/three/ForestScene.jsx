import { memo, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Terrain, Grass, Sky, Motes, heightAt } from './World'
import { buildTree, SPECIES_PARAMS } from './treeGen'
import { makeGrowMaterial, makeUniforms } from './growMaterial'
import { COMMUNITY } from './forestSpots'
import { ESPECIES } from '../../infrastructure/data/species'

const byId = Object.fromEntries(ESPECIES.map((e) => [e.id, e]))

/**
 * Floresta Viva: árvores da comunidade + a árvore do visitante (no máximo uma).
 * memo: só re-renderiza quando a árvore muda ou a cena entra/sai da tela.
 */
function ForestScene({ tree, fresh = false, active = true }) {
  const uniforms = useMemo(() => {
    const u = makeUniforms()
    u.uForest.value = 1
    u.uGrow.value = 1
    return u
  }, [])
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [14, 10, 19], fov: 40, near: 0.1, far: 400 }}
    >
      <fog attach="fog" args={['#eef0dc', 26, 90]} />
      <Ticker uniforms={uniforms} />
      <Sky top="#a9cbd8" horizon="#eef0dc" />
      <hemisphereLight args={['#fff6e3', '#4b6b3a', 0.85]} />
      <directionalLight
        position={[-6, 12, 7]}
        intensity={2.6}
        color="#fff1d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <Terrain />
      <Grass uniforms={uniforms} count={4000} radius={14} inner={0.2} />
      <Community uniforms={uniforms} />
      {tree && <UserTree key={tree.id} tree={tree} time={uniforms.uTime} fresh={fresh} />}
      <Motes area={26} height={6} count={140} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={6}
        maxDistance={34}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 1.4, 0]}
        autoRotate
        autoRotateSpeed={0.35}
        enableDamping
      />
    </Canvas>
  )
}

export default memo(ForestScene)

function Ticker({ uniforms }) {
  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime
    uniforms.uWind.value = 0.6 + Math.sin(s.clock.elapsedTime * 0.4) * 0.25
  })
  return null
}

// Árvores da comunidade: um InstancedMesh por espécie
function Community({ uniforms }) {
  const groups = useMemo(() => {
    return ESPECIES.map((e, i) => {
      const list = COMMUNITY.filter((t) => t.especie === e.id)
      if (!list.length) return null
      const geometry = buildTree(SPECIES_PARAMS[e.id], { seed: 50 + i, lod: 0.5 })
      geometry.setAttribute('aDelay', new THREE.InstancedBufferAttribute(new Float32Array(list.length), 1))
      geometry.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(new Float32Array(list.length).fill(1), 1))
      return { key: e.id, list, geometry, ...makeGrowMaterial({ uniforms, instanced: true }) }
    }).filter(Boolean)
  }, [uniforms])

  return groups.map((g) => (
    <instancedMesh
      key={g.key}
      args={[g.geometry, g.material, g.list.length]}
      customDepthMaterial={g.depthMaterial}
      castShadow
      receiveShadow
      frustumCulled={false}
      ref={(m) => {
        if (!m || m.userData.ready) return
        const o = new THREE.Object3D()
        g.list.forEach((t, j) => {
          o.position.set(t.x, heightAt(t.x, t.z) - 0.02, t.z)
          o.rotation.set(0, t.rot, 0)
          o.scale.setScalar(t.s)
          o.updateMatrix()
          m.setMatrixAt(j, o.matrix)
        })
        m.instanceMatrix.needsUpdate = true
        m.userData.ready = true
      }}
    />
  ))
}

function seedFromId(id) {
  let h = 0
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h % 1000) + 1
}

function UserTree({ tree, time, fresh }) {
  const species = byId[tree.especie] ? tree.especie : 'cabucu'
  const ring = useRef()
  const state = useRef({ start: null })
  const { geometry, material, depthMaterial, uniforms } = useMemo(() => {
    const u = { uGrow: { value: fresh ? 0 : 1 }, uTime: time, uWind: { value: 0.8 }, uForest: { value: 1 } }
    const geometry = buildTree(SPECIES_PARAMS[species], { seed: seedFromId(tree.id), lod: 1 })
    return { geometry, uniforms: u, ...makeGrowMaterial({ uniforms: u }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.id, species])

  useFrame((s) => {
    if (uniforms.uGrow.value < 1) {
      if (state.current.start === null) state.current.start = s.clock.elapsedTime
      const k = Math.min(1, (s.clock.elapsedTime - state.current.start) / 5)
      uniforms.uGrow.value = k
    }
    if (ring.current) {
      const pulse = 1 + Math.sin(s.clock.elapsedTime * 2.5) * 0.06
      ring.current.scale.setScalar(pulse)
    }
  })

  const y = heightAt(tree.x, tree.z)
  const sp = byId[species]
  return (
    <group position={[tree.x, y, tree.z]}>
      <mesh
        geometry={geometry}
        material={material}
        customDepthMaterial={depthMaterial}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.7, 0.82, 40]} />
        <meshBasicMaterial color="#eade71" transparent opacity={0.95} />
      </mesh>
      {(
        <Html position={[0, 5.4, 0]} center distanceFactor={14} zIndexRange={[20, 0]}>
          <div className="tree-tag">
            <strong>{tree.nome || 'Apoiador'}</strong>
            <span>{sp.nome}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
