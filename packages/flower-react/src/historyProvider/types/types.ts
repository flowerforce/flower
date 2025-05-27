import { PropsWithChildren } from 'react'

export type HistoryContextType = {
  index: number
  setIndex: (newIndex: number) => void
  isActive: true
  withUrl?: boolean
}

export type FallbackHistoryContext = {
  index: number
  setIndex: () => void
  isActive: false
  withUrl?: false
}

export type HistoryContextProviderProps = PropsWithChildren<{
  withUrl?: boolean
}>
