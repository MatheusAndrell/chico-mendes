// Posições da Floresta Viva (sem dependência de three.js, para o bundle principal)
import { mulberry32 } from './utils.js'
import { ESPECIES } from '../../infrastructure/data/species.js'

// Árvores "da comunidade": representam o trabalho do viveiro
export const COMMUNITY = (() => {
  const r = mulberry32(2005)
  const out = []
  let tries = 0
  while (out.length < 46 && tries < 5000) {
    tries++
    const a = r() * Math.PI * 2
    const d = 4.5 + Math.pow(r(), 0.8) * 13
    const x = Math.cos(a) * d
    const z = Math.sin(a) * d
    if (out.some((t) => (t.x - x) ** 2 + (t.z - z) ** 2 < 2.4 * 2.4)) continue
    out.push({ id: 'c' + out.length, x, z, especie: ESPECIES[Math.floor(r() * ESPECIES.length)].id, s: 0.8 + r() * 0.4, rot: r() * 6.28 })
  }
  return out
})()

export function findSpot(existing) {
  const all = [...COMMUNITY, ...existing]
  for (let ring = 0; ring < 6; ring++) {
    for (let i = 0; i < 60; i++) {
      const a = Math.random() * Math.PI * 2
      const d = 0.5 + ring * 1.6 + Math.random() * 3.2
      const x = Math.cos(a) * d
      const z = Math.sin(a) * d
      if (all.every((t) => (t.x - x) ** 2 + (t.z - z) ** 2 > 2.1 * 2.1)) return { x, z }
    }
  }
  const a = Math.random() * Math.PI * 2
  const d = 18 + Math.random() * 4
  return { x: Math.cos(a) * d, z: Math.sin(a) * d }
}
