import { FlowerProvider } from '@flowerforce/flower-react'
import {
  ConfigureStoreOptions,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import { ExternalReducers } from './Examples/ExampleExternalReducers'

const customReducer = createSlice({
  name: 'My_Custom_Reducer_1',
  initialState: {
    count: 0
  },
  reducers: {
    add: (state, { payload }: PayloadAction<number>) => {
      state.count += payload
    }
  }
})
const customReducer2 = createSlice({
  name: 'My_Custom_Reducer_2',
  initialState: {
    count2: 0
  },
  reducers: {
    add: (state, { payload }: PayloadAction<number>) => {
      state.count2 += payload
    }
  }
})

const reducers = {
  customReducer: customReducer.reducer,
  customReducer2: customReducer2.reducer
}

export const actionsCustom1 = customReducer.actions
export const actionsCustom2 = customReducer2.actions

const config: ConfigureStoreOptions = {
  reducer: reducers,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
}

export function AppFlowWithCustomReducers() {
  return (
    <div
      className="Form"
      style={{ display: 'flex', flexDirection: 'column', padding: '50px' }}
    >
      FLOW WITH EXTERNAL REDUCERS
      <FlowerProvider<Record<string, any>> configureStore={config}>
        <ExternalReducers />
      </FlowerProvider>
    </div>
  )
}
