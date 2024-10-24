import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Devtool } from '@flowerforce/devtool'
import { Example12 } from './Examples/Example12'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { FlowerProvider, reducerFlower } from '@flowerforce/flower-react'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    }
  }
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    flower: reducerFlower.flower
  }
})

root.render(
  <Provider store={store}>
    <FlowerProvider store={store}>
      <Example12 />
    </FlowerProvider>
  </Provider>
)

Devtool({
  sessionId: 'L2ak8Aw13e2C9Lc0WgQ7e',
  sourceMap: require('./.flower.source-map.json')
})
