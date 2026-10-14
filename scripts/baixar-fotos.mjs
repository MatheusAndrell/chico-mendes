#!/usr/bin/env node
/**
 * Baixa as fotos do site antigo (Wix) para public/fotos/ e marca cada uma em
 * src/infrastructure/data/fotos.json, para que o site passe a usar a cópia local.
 *
 * Uso:  npm run fotos
 *
 * - Baixa em até 1920px no maior lado, em WebP ou JPEG (o que ficar menor).
 * - Pode ser rodado mais de uma vez: pula o que já foi baixado.
 * - Para baixar de novo uma foto, apague o arquivo dela em public/fotos/.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const MANIFESTO = join(RAIZ, 'src/infrastructure/data/fotos.json')
const PASTA = join(RAIZ, 'public/fotos')
const MAX = 1920

const nomeArquivo = (chave) => chave.replace(/[A-Z]/g, (l) => '-' + l.toLowerCase())

async function baixar(id, chave, formato) {
  const url = `https://static.wixstatic.com/media/${id}/v1/fit/w_${MAX},h_${MAX},q_85/${nomeArquivo(chave)}.${formato}`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const tipo = resp.headers.get('content-type') || ''
  if (!tipo.startsWith('image/')) throw new Error(`resposta não é imagem (${tipo})`)
  const ext = tipo.includes('webp') ? 'webp' : tipo.includes('png') ? 'png' : tipo.includes('avif') ? 'avif' : 'jpg'
  return { dados: Buffer.from(await resp.arrayBuffer()), ext }
}

async function main() {
  mkdirSync(PASTA, { recursive: true })
  const fotos = JSON.parse(readFileSync(MANIFESTO, 'utf8'))
  let novos = 0
  let falhas = 0

  for (const [chave, f] of Object.entries(fotos)) {
    if (f.arquivo && existsSync(join(PASTA, f.arquivo))) {
      console.log(`  ok   ${f.arquivo} (já baixada)`)
      continue
    }
    try {
      // pede WebP e JPEG e fica com o menor (fotos que eram PNG às vezes saem menores em JPEG)
      const opcoes = (await Promise.allSettled([baixar(f.id, chave, 'webp'), baixar(f.id, chave, 'jpg')]))
        .filter((o) => o.status === 'fulfilled')
        .map((o) => o.value)
      if (!opcoes.length) throw new Error('não foi possível baixar (verifique a conexão)')
      const r = opcoes.sort((a, b) => a.dados.length - b.dados.length)[0]
      const arquivo = `${nomeArquivo(chave)}.${r.ext}`
      writeFileSync(join(PASTA, arquivo), r.dados)
      f.arquivo = arquivo
      novos++
      console.log(`  ↓    ${arquivo} (${Math.round(r.dados.length / 1024)} KB)`)
    } catch (e) {
      falhas++
      console.error(`  ✗    ${chave}: ${e.message}`)
    }
  }

  writeFileSync(MANIFESTO, JSON.stringify(fotos, null, 2) + '\n')
  console.log(`\n${novos} foto(s) baixada(s), ${falhas} falha(s). Fotos em public/fotos/.`)
  if (falhas) process.exitCode = 1
}

main()
