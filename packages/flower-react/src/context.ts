import React, { createContext } from 'react'

export type FlowerContext = {
  flowName?: string | undefined
  currentNode?: string | undefined
  autostart?: boolean | undefined
}

const context = createContext<FlowerContext>({})

export default context
