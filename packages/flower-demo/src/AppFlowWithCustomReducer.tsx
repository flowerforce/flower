import {
  createSliceWithFlower,
  createStoreWithFlower,
  FlowerProvider
} from '@flowerforce/flower-react'
import { ConfigureStoreOptions, PayloadAction } from '@reduxjs/toolkit'
import { ExternalReducers } from './Examples/ExampleExternalReducers'
import { Provider } from 'react-redux'

const customReducer = createSliceWithFlower({
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
const customReducer2 = createSliceWithFlower({
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

const store = createStoreWithFlower({
  reducer: reducers,
  devTools: true
})

export function AppFlowWithCustomReducers() {
  return (
    <div
      className="Form"
      style={{ display: 'flex', flexDirection: 'column', padding: '50px' }}
    >
      FLOW WITH EXTERNAL REDUCERS
      <Provider store={store}>
        <ExternalReducers />
      </Provider>
    </div>
  )
}
