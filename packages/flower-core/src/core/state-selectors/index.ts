import { IFlowerSelectors, IFormSelectors } from '../../interfaces'
import { FlowerCoreStateBaseSelectors } from './FlowerCoreStateSelectors'
import { FlowerCoreStateDataSelectors } from './FlowerFormStateSelectors'

export const FlowerCoreStateSelectors: IFlowerSelectors & IFormSelectors = {
  ...FlowerCoreStateBaseSelectors,
  ...FlowerCoreStateDataSelectors
}
