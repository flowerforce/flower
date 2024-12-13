import { createSlice } from '@reduxjs/toolkit'
import {
  Flower,
  FlowerCoreBaseReducers,
  REDUCER_NAME
} from '@flowerforce/flower-core'

const flowerReducer = createSlice({
  name: REDUCER_NAME.FLOWER_FLOW,
  initialState: {} as Record<string, Flower<Record<string, any>>>,
  reducers: FlowerCoreBaseReducers
})

export const { actions } = flowerReducer

export const flowerFlowReducer = flowerReducer.reducer

export default flowerReducer
