import { IFlowerSelectors, IDataSelectors } from '../../interfaces'
import { FlowerCoreStateBaseSelectors } from './FlowerCoreStateSelectors'
import { FlowerCoreStateDataSelectors } from './FlowerDataStateSelectors'

export const FlowerCoreStateSelectors: IFlowerSelectors & IDataSelectors = {
  ...FlowerCoreStateBaseSelectors,
  ...FlowerCoreStateDataSelectors
}
