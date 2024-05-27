import React, { createContext } from 'react'

export type FlowerContext = {
  flowName?: string | undefined
  currentNode?: string | undefined
  autostart?: boolean | undefined
  initialData?: Record<string, any>
}

const _context = createContext<FlowerContext>({})

export const context = _context
export const Provider = _context.Provider
export const Consumer = _context.Consumer
