import React, { createContext } from 'react'

export type FlowerContext = {
  flowName?: string | undefined
  currentNode?: string | undefined
  autostart?: boolean | undefined
}

const context = createContext<FlowerContext>({})

const { Provider: FlowerCoreContextProvider } = context
const { Consumer: FlowerCoreContextConsumer } = context

const FlowerCoreContext = context
export {
  FlowerCoreContextProvider,
  FlowerCoreContextConsumer,
  FlowerCoreContext
}
