import * as THREE from 'three'
import { mulberry32 } from './utils.js'

/**
 * Gera uma árvore procedural (galhos recursivos + folhas) numa única geometria.
 * Cada vértice carrega aBase/aBirth/aDur para animar o crescimento no shader.
 *
 * Linha do tempo normalizada (0..1):
 *   tronco → galhos por nível → folhas (no fim, brotando nas pontas)
 */

const UP = new THREE.Vector3(0, 1, 0)

export const SPECIES_PARAMS = {
  ipe: {
    trunk: 1.55, radius: 0.13, depth: 5, children: [2, 3], lenDecay: 0.74, radDecay: 0.62,
    spread: [0.45, 0.85], upward: 0.18, gnarl: 0.22, leafPerTip: 11, leafSize: [0.16, 0.24], clusterR: 0.32,
    leaves: ['#f2c230', '#e8ad1c', '#f7d65a', '#d99a12', '#b7c34a'], bark: '#5b3d2a'
  },
  quaresmeira: {
    trunk: 1.2, radius: 0.1, depth: 5, children: [2, 3], lenDecay: 0.72, radDecay: 0.62,
    spread: [0.5, 0.9], upward: 0.12, gnarl: 0.25, leafPerTip: 11, leafSize: [0.14, 0.22], clusterR: 0.3,
    leaves: ['#8d55b8', '#a46fd0', '#6f3e9c', '#b98ad9', '#5b8a45'], bark: '#4f3a2e'
  },
  cabucu: {
    trunk: 1.35, radius: 0.11, depth: 5, children: [2, 3], lenDecay: 0.73, radDecay: 0.63,
    spread: [0.4, 0.8], upward: 0.2, gnarl: 0.2, leafPerTip: 12, leafSize: [0.18, 0.28], clusterR: 0.32,
    leaves: ['#3f7d3a', '#5a9a47', '#2e6630', '#77ad55', '#4b8a3e'], bark: '#5a4632'
  },
  jequitiba: {
    trunk: 2.3, radius: 0.15, depth: 5, children: [2, 3], lenDecay: 0.68, radDecay: 0.6,
    spread: [0.3, 0.65], upward: 0.32, gnarl: 0.15, leafPerTip: 10, leafSize: [0.16, 0.24], clusterR: 0.3,
    leaves: ['#2f6b34', '#3d7f3d', '#24562a', '#4f8f47', '#5f8f3b'], bark: '#6a4a33'
  },
  araucaria: {
    trunk: 3.0, radius: 0.12, depth: 3, children: [5, 6], lenDecay: 0.5, radDecay: 0.45,
    spread: [1.15, 1.3], upward: 0.55, gnarl: 0.08, leafPerTip: 14, leafSize: [0.14, 0.2], clusterR: 0.26,
    leaves: ['#24502e', '#2f6038', '#1d4426', '#3b6e3c'], bark: '#5e4030', crown: true
  },
  paubrasil: {
    trunk: 1.25, radius: 0.1, depth: 5, children: [2, 3], lenDecay: 0.72, radDecay: 0.62,
    spread: [0.5, 0.95], upward: 0.1, gnarl: 0.3, leafPerTip: 12, leafSize: [0.12, 0.18], clusterR: 0.3,
    leaves: ['#5f9b3c', '#77b04a', '#4a8434', '#8cbf55', '#3f7330'], bark: '#3d2c22'
  }
}

export function buildTree(params, { seed = 1, lod = 1, scale = 1 } = {}) {
  const P = { ...params }
  const rand = mulberry32(Math.floor(seed * 7919) + 13)
  const R = (a, b) => a + rand() * (b - a)
  const depthMax = lod < 1 ? Math.max(2, P.depth - 2) : P.depth
  const radial = lod < 1 ? 5 : 7
  const segsPerBranch = lod < 1 ? 2 : 3
  const leafPerTip = Math.round(P.leafPerTip * (lod < 1 ? 1.8 : 2.1))
  const leafScale = lod < 1 ? 1.55 : 1.05

  const pos = [], nor = [], col = [], base = [], center = [], bark = [], birth = [], dur = [], idx = [], leafJ = []
  let v = 0
  const barkC = new THREE.Color(P.bark)
  const barkDark = barkC.clone().multiplyScalar(0.7)
  const leafCols = P.leaves.map((c) => new THREE.Color(c))

  const tips = []
  // tempo: cada nível ocupa uma faixa; folhas ocupam o fim
  const levelSpan = 0.62 / (depthMax + 1)

  const tmp = new THREE.Vector3()
  const side = new THREE.Vector3()
  const side2 = new THREE.Vector3()

  function tube(p0, p1, r0, r1, b, d) {
    const dir = tmp.subVectors(p1, p0).normalize()
    side.copy(Math.abs(dir.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : UP).cross(dir).normalize()
    side2.crossVectors(dir, side).normalize()
    const start = v
    for (let ring = 0; ring < 2; ring++) {
      const c = ring ? p1 : p0
      const r = ring ? r1 : r0
      for (let i = 0; i < radial; i++) {
        const a = (i / radial) * Math.PI * 2
        const nx = side.x * Math.cos(a) + side2.x * Math.sin(a)
        const ny = side.y * Math.cos(a) + side2.y * Math.sin(a)
        const nz = side.z * Math.cos(a) + side2.z * Math.sin(a)
        pos.push(c.x + nx * r, c.y + ny * r, c.z + nz * r)
        nor.push(nx, ny, nz)
        const k = 0.85 + rand() * 0.25
        const cc = i % 2 ? barkC : barkDark
        col.push(cc.r * k, cc.g * k, cc.b * k)
        base.push(p0.x, p0.y, p0.z)
        center.push(c.x, c.y, c.z)
        bark.push(1)
        birth.push(b)
        dur.push(d)
        v++
      }
    }
    for (let i = 0; i < radial; i++) {
      const a = start + i
      const b2 = start + ((i + 1) % radial)
      const c = a + radial
      const d2 = b2 + radial
      idx.push(a, b2, c, b2, d2, c)
    }
    // tampa da ponta (evita buraco visível)
    const tip = v
    pos.push(p1.x, p1.y, p1.z); nor.push(dir.x, dir.y, dir.z)
    col.push(barkC.r, barkC.g, barkC.b); base.push(p0.x, p0.y, p0.z); center.push(p1.x, p1.y, p1.z); bark.push(1); birth.push(b); dur.push(d); v++
    for (let i = 0; i < radial; i++) idx.push(start + radial + i, start + radial + ((i + 1) % radial), tip)
  }

  function branch(p0, dir, len, r0, level, t0) {
    const d = levelSpan
    let p = p0.clone()
    let dd = dir.clone()
    let r = r0
    const rEnd = r0 * (level === depthMax ? 0.35 : P.radDecay * 1.05)
    for (let s = 0; s < segsPerBranch; s++) {
      // curva suave: desvio aleatório + leve tendência para cima (fototropismo)
      dd.x += R(-1, 1) * P.gnarl
      dd.z += R(-1, 1) * P.gnarl
      dd.y += P.upward * 0.35
      dd.normalize()
      const segLen = len / segsPerBranch
      const p1 = p.clone().addScaledVector(dd, segLen)
      const r1 = r + (rEnd - r) / segsPerBranch
      const b = t0 + (s / segsPerBranch) * d
      tube(p, p1, r, r1, b, d / segsPerBranch + 0.02)
      p = p1
      r = r1
    }
    const tEnd = t0 + d
    if (level >= depthMax) {
      tips.push({ p, dir: dd.clone(), t: tEnd })
      return
    }
    const n = Math.round(R(P.children[0], P.children[1] + 0.49))
    const golden = 2.39996
    const phase = R(0, Math.PI * 2)
    for (let i = 0; i < n; i++) {
      const az = phase + i * golden + (P.crown ? (i / n) * Math.PI * 2 : 0)
      const tilt = R(P.spread[0], P.spread[1])
      // gira a direção do pai pelo ângulo de abertura, em torno de um eixo perpendicular
      const ax = new THREE.Vector3().crossVectors(dd, Math.abs(dd.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : UP).normalize()
      ax.applyAxisAngle(dd, az)
      const nd = dd.clone().applyAxisAngle(ax, tilt)
      if (P.crown) nd.y = Math.max(nd.y, 0.05) + 0.12 * level
      nd.normalize()
      const nl = len * P.lenDecay * R(0.85, 1.1)
      branch(p, nd, nl, r * P.radDecay, level + 1, tEnd - d * 0.15)
    }
    // araucária e copas cheias: folhas também em galhos intermediários
    // folhas também ao longo dos galhos intermediários: a copa enche aos poucos
    if (level >= Math.max(1, depthMax - 3)) tips.push({ p, dir: dd.clone(), t: tEnd, small: true })
  }

  const trunkDir = new THREE.Vector3(R(-0.06, 0.06), 1, R(-0.06, 0.06)).normalize()
  // araucária: tronco longo e reto até a copa
  branch(new THREE.Vector3(0, 0, 0), trunkDir, P.trunk, P.radius, 0, 0)

  // ───────── folhas ─────────
  const qa = new THREE.Quaternion()
  // centro aproximado da copa (para normais "esféricas", que suavizam a luz da folhagem)
  const crownC = new THREE.Vector3()
  tips.forEach((t) => crownC.add(t.p))
  crownC.divideScalar(Math.max(1, tips.length))
  const tmpN = new THREE.Vector3()

  tips.forEach((tip) => {
    const count = tip.small ? Math.ceil(leafPerTip * 0.4) : leafPerTip
    for (let i = 0; i < count; i++) {
      const c = tip.p.clone().add(
        new THREE.Vector3(R(-1, 1), R(-0.6, 1), R(-1, 1)).normalize().multiplyScalar(R(0.2, 1) * P.clusterR * (lod < 1 ? 1.6 : 1.25))
      )
      const size = R(P.leafSize[0], P.leafSize[1]) * leafScale
      qa.setFromEuler(new THREE.Euler(R(0, 6.28), R(0, 6.28), R(0, 6.28)))
      const w = size * 0.42
      const L = size
      const local = [
        [0, 0, 0],
        [-w, L * 0.45, w * 0.25],
        [0, L, 0],
        [w, L * 0.45, w * 0.25]
      ]
      const lc = leafCols[Math.floor(rand() * leafCols.length)].clone().multiplyScalar(R(0.85, 1.1))
      tmpN.subVectors(c, crownC).normalize()
      tmpN.y = tmpN.y * 0.6 + 0.4
      tmpN.normalize()
      const b = tip.t
      const j = R(-0.04, 0.14)
      const s0 = v
      local.forEach(([x, y, z]) => {
        const p = new THREE.Vector3(x, y, z).applyQuaternion(qa).add(c)
        pos.push(p.x, p.y, p.z)
        nor.push(tmpN.x, tmpN.y, tmpN.z)
        col.push(lc.r, lc.g, lc.b)
        base.push(c.x, c.y, c.z)
        center.push(c.x, c.y, c.z)
        bark.push(0)
        birth.push(b)
        dur.push(-1)
        leafJ.push(j)
        v++
      })
      idx.push(s0, s0 + 1, s0 + 2, s0, s0 + 2, s0 + 3)
    }
  })

  // normaliza a linha do tempo dos galhos para caber em 0..0.75
  let maxBranch = 0
  for (let i = 0; i < birth.length; i++) if (dur[i] > 0) maxBranch = Math.max(maxBranch, birth[i] + dur[i])
  const k = 0.75 / Math.max(0.0001, maxBranch)
  let li = 0
  for (let i = 0; i < birth.length; i++) {
    if (dur[i] > 0) {
      birth[i] *= k
      dur[i] *= k
    } else {
      // folhas brotam logo depois que a ponta do galho chega, até ~0.92
      birth[i] = Math.min(0.88, Math.max(0.4, birth[i] * k * 0.88 - 0.04 + leafJ[li++]))
      dur[i] = 0.09
    }
  }

  const g = new THREE.BufferGeometry()
  const S = (arr) => arr.map((x) => x * scale)
  g.setAttribute('position', new THREE.Float32BufferAttribute(S(pos), 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setAttribute('aBase', new THREE.Float32BufferAttribute(S(base), 3))
  g.setAttribute('aCenter', new THREE.Float32BufferAttribute(S(center), 3))
  g.setAttribute('aBark', new THREE.Float32BufferAttribute(bark, 1))
  g.setAttribute('aBirth', new THREE.Float32BufferAttribute(birth, 1))
  g.setAttribute('aDur', new THREE.Float32BufferAttribute(dur, 1))
  g.setIndex(idx)
  g.computeBoundingSphere()
  // a árvore cresce: garante bounding grande o bastante para não sumir no frustum culling
  g.boundingSphere.radius *= 1.2
  return g
}
