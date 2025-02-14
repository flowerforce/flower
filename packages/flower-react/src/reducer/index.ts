import { REDUCER_NAME } from '@flowerforce/flower-core'
import { flowerFlowReducer } from './flowerReducer'
import { REDUCERS_TYPES } from '@flowerforce/flower-react-store'

export const reducerFlower: REDUCERS_TYPES = {
  [REDUCER_NAME.FLOWER_FLOW]: flowerFlowReducer
}
