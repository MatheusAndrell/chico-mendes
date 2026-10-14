// Raiz de composição: conecta implementações concretas aos casos de uso.
import { makeTreeUseCases } from '../application/tree/treeUseCases'
import { makeLocalStorageTreeRepository } from '../infrastructure/storage/localStorageTreeRepository'
import { transparencyRepository } from '../infrastructure/repositories/transparencyRepository'
import { ESPECIES } from '../infrastructure/data/species'
import { findSpot } from '../presentation/three/forestSpots'

export const treeUseCases = makeTreeUseCases({
  repository: makeLocalStorageTreeRepository(),
  especiesValidas: ESPECIES.map((e) => e.id),
  findSpot: () => findSpot([])
})

export { transparencyRepository }
