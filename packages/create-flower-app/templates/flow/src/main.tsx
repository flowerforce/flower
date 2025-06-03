import { Devtool } from '@flowerforce/devtool'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { StrictMode } from 'react'
import { FlowerProvider } from '@flowerforce/flower-react'

Devtool({
  port: 8770,
  host: 'localhost',
  sessionId: ''
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div id='historyprovideropen' />
    <FlowerProvider enableReduxDevtool>
      <App />
    </FlowerProvider>
    <div id='historyproviderclose' />
  </StrictMode>
)
