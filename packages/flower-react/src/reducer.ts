import { createSlice } from '@reduxjs/toolkit'
import { FlowerCoreReducers, Flower } from '@flowerforce/flower-core'

const flowerReducer = createSlice({
  name: 'flower',
  initialState: {} as Record<string, Flower<Record<string, any>>>,
  reducers: FlowerCoreReducers
})

export const { actions } = flowerReducer

export const reducerFlower = {
  flower: flowerReducer.reducer
}

export default flowerReducer
