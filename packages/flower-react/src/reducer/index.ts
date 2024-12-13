import { REDUCER_NAME } from '@flowerforce/flower-core'
import { flowerFlowReducer } from './flowerReducer'
import { flowerFormReducer } from './formReducer'

export const reducerFlower: Record<
  REDUCER_NAME,
  typeof flowerFlowReducer | typeof flowerFormReducer
> = {
  [REDUCER_NAME.FLOWER_FLOW]: flowerFlowReducer,
  [REDUCER_NAME.FLOWER_DATA]: flowerFormReducer
}
