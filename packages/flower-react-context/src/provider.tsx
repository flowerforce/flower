import { createContext } from 'react'
import { FlowerReactContextProps } from './types'

const _context = createContext<FlowerReactContextProps>({})

export const FlowerReactContext = _context
export const FlowerReactProvider = _context.Provider
export const FlowerReactConsumer = _context.Consumer
