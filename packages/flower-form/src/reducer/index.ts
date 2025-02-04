import { REDUCER_NAME } from '@flowerforce/flower-core'
import { flowerFormReducer } from './formReducer'

export const reducerForm: Record<
  REDUCER_NAME.FLOWER_DATA,
  typeof flowerFormReducer
> = {
  FlowerData: flowerFormReducer
}
