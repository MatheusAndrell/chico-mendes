/**
 * Contrato do repositório de árvores (porta da camada de domínio).
 * A infraestrutura fornece a implementação (localStorage hoje; um banco
 * de dados amanhã, sem mudar os casos de uso).
 *
 * @typedef {Object} TreeRepository
 * @property {() => import('./Tree').Tree | null} get
 * @property {(tree: import('./Tree').Tree) => void} save
 * @property {() => void} clear
 */
export {}
