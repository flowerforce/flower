import type { EnhancedStore } from '@reduxjs/toolkit'
import type { Flower } from '@flowerforce/flower-core'

export type FlowerProviderState = {
  flower: Record<string, Flower<any>>
}

export type FlowerProviderStore = EnhancedStore<FlowerProviderState>

export type FlowerProviderProps = FlowerProviderStore

export interface FlowerProviderOptions {
  enableReduxDevtool?: boolean
  store?: FlowerProviderStore
}
