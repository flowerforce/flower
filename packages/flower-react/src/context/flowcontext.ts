import { createContext } from 'react'

export type FlowerContext = {
  flowName?: string | undefined
  currentNode?: string | undefined
  autostart?: boolean | undefined
  initialData?: Record<string, unknown>
}

const _context = createContext<FlowerContext>({})

export const FlowContext = _context
export const FlowProvider = _context.Provider
export const FlowConsumer = _context.Consumer
