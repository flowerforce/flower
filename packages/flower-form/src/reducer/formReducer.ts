import { createSlice } from '@reduxjs/toolkit'
import { FlowerCoreFormReducers } from '@flowerforce/flower-core'

const formReducer = createSlice({
  name: 'FlowerData',
  initialState: {} as Record<string, Record<string, any>>,
  reducers: FlowerCoreFormReducers
})

export const { actions } = formReducer

export const flowerFormReducer = formReducer.reducer

export default formReducer
