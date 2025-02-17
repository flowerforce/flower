import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppFlow from './AppFlow'
import AppForm from './AppForm'

import { Devtool } from '@flowerforce/devtool'
import { MainApp } from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// root.render(<AppForm />)
root.render(<MainApp />)

Devtool({
  sessionId: 'L2ak8Aw13e2C9Lc0WgQ7e',
  sourceMap: require('./.flower.source-map.json')
})
