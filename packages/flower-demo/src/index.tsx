import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { FlowerProvider } from '@flowerforce/flower-react'
import { Devtool } from '@flowerforce/devtool'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <FlowerProvider enableReduxDevtool>
    <App />
  </FlowerProvider>
)

Devtool({
  sessionId: 'L2ak8Aw13e2C9Lc0WgQ7e',
  sourceMap: require('./.flower.source-map.json')
})
