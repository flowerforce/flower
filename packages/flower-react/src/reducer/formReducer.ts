import { createSlice } from '@reduxjs/toolkit'
import { FlowerCoreFormReducers, Flower } from '@flowerforce/flower-core'

const formReducer = createSlice({
  name: 'form',
  initialState: {} as Record<string, Flower<Record<string, any>>>,
  reducers: FlowerCoreFormReducers
})

export const { actions } = formReducer

export const reducerFlowerForm = formReducer.reducer

export default formReducer
