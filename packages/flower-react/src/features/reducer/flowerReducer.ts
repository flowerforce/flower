import { createSlice } from '@reduxjs/toolkit'
import { FlowerCoreBaseReducers, REDUCER_NAME } from '@flowerforce/flower-core'
import { reducerData, REDUCERS_TYPES } from '@flowerforce/flower-react-store'

export const flowerReducer = createSlice({
  name: REDUCER_NAME.FLOWER_FLOW,
  initialState: {},
  reducers: FlowerCoreBaseReducers
})

export const flowerActions = flowerReducer.actions

export const flowerFlowReducer = flowerReducer.reducer

export const reducerFlower: REDUCERS_TYPES = {
  [REDUCER_NAME.FLOWER_FLOW]: flowerFlowReducer
}

export const flowerReducers = {
  ...reducerFlower,
  ...reducerData
}
