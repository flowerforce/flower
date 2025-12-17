import { ThunkMiddleware, Tuple, configureStore } from '@reduxjs/toolkit'
import { Flower } from '@flowerforce/flower-core'
import { UnknownAction } from 'redux'

export interface FlowerProviderInterface {
  render(): JSX.Element
}

type FlowerStoreReducers = {
  flower: Record<string, Flower<any>>
}

export type FlowerStore = ReturnType<
  typeof configureStore<
    FlowerStoreReducers,
    UnknownAction,
    Tuple<[ThunkMiddleware<FlowerStoreReducers, UnknownAction>]>
  >
>

export type FlowerProviderProps = FlowerStore
