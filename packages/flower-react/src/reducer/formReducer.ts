import { createSlice } from '@reduxjs/toolkit'
import {
  FlowerCoreFormReducers,
  Flower,
  REDUCER_NAME
} from '@flowerforce/flower-core'

const formReducer = createSlice({
  name: REDUCER_NAME.FLOWER_DATA,
  initialState: {} as Record<string, Flower<Record<string, any>>>,
  reducers: FlowerCoreFormReducers
})

export const { actions } = formReducer

export const flowerFormReducer = formReducer.reducer

export default formReducer
