import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { FlowerProvider } from '@flowerforce/flower-react'
import { Devtool } from '@flowerforce/devtool'
import { store } from './store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider store={store}>
    <FlowerProvider store={store} enableReduxDevtool>
      <App />
    </FlowerProvider>
  </Provider>
)

Devtool({
  sessionId: 'L2ak8Aw13e2C9Lc0WgQ7e',
  sourceMap: require('./.flower.source-map.json')
})
