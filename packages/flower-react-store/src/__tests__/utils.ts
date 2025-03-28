import {
  REDUCER_NAME,
  Flower,
  FlowerCoreBaseReducers
} from '@flowerforce/flower-core'
import { createSlice } from '@reduxjs/toolkit'
import { REDUCERS_TYPES } from '../types/reducerTypes'

export const createCustomReducer = ({
  flowReducer,
  config
}: {
  flowReducer?: boolean
  config?: { name: string }
}) => {
  if (flowReducer) {
    const flowerReducer = createSlice({
      name: REDUCER_NAME.FLOWER_FLOW,
      initialState: {},
      reducers: FlowerCoreBaseReducers
    })

    const flowerFlowReducer = flowerReducer.reducer
    const reducerFlower: REDUCERS_TYPES = {
      [REDUCER_NAME.FLOWER_FLOW]: flowerFlowReducer
    }
    return reducerFlower
  }
  if (config) {
    const customReducer = createSlice({
      name: config.name,
      initialState: {},
      reducers: {
        init: (state) => {
          return state
        }
      }
    })
    const resultReducer = {
      [config.name]: customReducer.reducer
    }
    return resultReducer
  }
}
