import { IFlowerSelectors, IFormSelectors } from '../../interfaces'
import { FlowerCoreStateBaseSelectors } from './FlowerCoreStateSelectors'
import { FlowerCoreStateFormSelectors } from './FlowerFormStateSelectors'

export const FlowerCoreStateSelectors: IFlowerSelectors & IFormSelectors = {
  ...FlowerCoreStateBaseSelectors,
  ...FlowerCoreStateFormSelectors
}
