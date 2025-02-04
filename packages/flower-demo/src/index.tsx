import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppFlow from './AppFlow'
import AppForm from './AppForm'

import { FormProvider } from '@flowerforce/flower-form'

import { Devtool } from '@flowerforce/devtool'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<AppForm />)

Devtool({
  sessionId: 'L2ak8Aw13e2C9Lc0WgQ7e',
  sourceMap: require('./.flower.source-map.json')
})
