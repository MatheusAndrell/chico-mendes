import { createTree, TreeAlreadyPlantedError } from '../../domain/tree/Tree'

/**
 * Casos de uso da Floresta Viva. Recebem o repositório por injeção,
 * então não sabem se os dados estão no localStorage ou num servidor.
 */
export function makeTreeUseCases({ repository, especiesValidas, findSpot }) {
  return {
    getMyTree() {
      return repository.get()
    },

    plantTree({ nome, especie }) {
      if (repository.get()) throw new TreeAlreadyPlantedError()
      const { x, z } = findSpot()
      const tree = createTree({ nome, especie, x, z, especiesValidas })
      repository.save(tree)
      return tree
    }
  }
}
