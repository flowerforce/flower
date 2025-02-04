import { createSlice } from '@reduxjs/toolkit'
import { FlowerCoreFormReducers, REDUCER_NAME } from '@flowerforce/flower-core'

const formReducer = createSlice({
  name: REDUCER_NAME.FLOWER_DATA,
  initialState: {} as Record<string, Record<string, any>>,
  reducers: FlowerCoreFormReducers
})

export const { actions } = formReducer

export const flowerFormReducer = formReducer.reducer

export default formReducer
