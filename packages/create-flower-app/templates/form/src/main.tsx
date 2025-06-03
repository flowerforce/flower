import { Devtool } from '@flowerforce/devtool'
import { createRoot } from 'react-dom/client'
import { FormProvider } from '@flowerforce/flower-react-form'

import { App } from './App'
import { StrictMode } from 'react'

Devtool({
  port: 8770,
  host: 'localhost',
  sessionId: ''
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FormProvider>
      <App />
    </FormProvider>
  </StrictMode>
)
