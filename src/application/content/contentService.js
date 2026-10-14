// Fachada de leitura do conteúdo do site: a apresentação não conhece a origem dos dados.
import { ORGANIZACAO, FRASES, NUMEROS, PROJETOS, HISTORIA, PREMIOS, CABUCU, DOACAO, NECESSIDADES } from '../../infrastructure/data/content'
import { POSTS } from '../../infrastructure/data/blog'
import { ESPECIES } from '../../infrastructure/data/species'
import { FOTOS } from '../../infrastructure/data/media'

export const content = { ORGANIZACAO, FRASES, NUMEROS, PROJETOS, HISTORIA, PREMIOS, CABUCU, DOACAO, NECESSIDADES, ESPECIES, FOTOS }

export const listPosts = () => [...POSTS].sort((a, b) => a.numero - b.numero)
export const getPost = (slug) => POSTS.find((p) => p.slug === slug) ?? null
export const getProject = (id) => PROJETOS.find((p) => p.id === id) ?? null
