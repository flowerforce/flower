import { REDUCER_NAME } from '@flowerforce/flower-core'
import { REDUCERS_TYPES } from '../types'
import { flowerDataReducer } from './dataReducer'

export const reducerData: REDUCERS_TYPES = {
  [REDUCER_NAME.FLOWER_DATA]: flowerDataReducer
}
