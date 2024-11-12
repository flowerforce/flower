import { createSlice } from '@reduxjs/toolkit'
import { Flower, FlowerCoreBaseReducers } from '@flowerforce/flower-core'

const flowerReducer = createSlice({
  name: 'flower',
  initialState: {} as Record<string, Flower<Record<string, any>>>,
  reducers: FlowerCoreBaseReducers
})

export const { actions } = flowerReducer

export const reducerFlower = flowerReducer.reducer

export default flowerReducer
