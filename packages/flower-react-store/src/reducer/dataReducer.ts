import { createSlice } from '@reduxjs/toolkit'
import { FlowerCoreDataReducers, REDUCER_NAME } from '@flowerforce/flower-core'
import { REDUCERS_TYPES } from '../types/reducerTypes'

export const dataReducer = createSlice({
  name: REDUCER_NAME.FLOWER_DATA,
  initialState: {} as Record<string, Record<string, any>>,
  reducers: FlowerCoreDataReducers
})

export const flowerDataActions = dataReducer.actions

export const flowerDataReducer = dataReducer.reducer

export const reducerData: REDUCERS_TYPES = {
  [REDUCER_NAME.FLOWER_DATA]: flowerDataReducer
}
