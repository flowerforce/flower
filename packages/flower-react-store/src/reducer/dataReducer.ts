import { createSlice } from '@reduxjs/toolkit'
import { FlowerCoreFormReducers, REDUCER_NAME } from '@flowerforce/flower-core'

const dataReducer = createSlice({
  name: REDUCER_NAME.FLOWER_DATA,
  initialState: {} as Record<string, Record<string, any>>,
  reducers: FlowerCoreFormReducers
})

export const { actions } = dataReducer

export const flowerDataReducer = dataReducer.reducer

export default dataReducer
