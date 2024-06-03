import { ThunkMiddleware, Tuple, configureStore } from '@reduxjs/toolkit'
import { Flower } from '@flowerforce/flower-core'
import { UnknownAction } from 'redux'

export interface FlowerProviderInterface {
  render(): JSX.Element
}

// TODO add ref, enableDevtool

export type FlowerProviderProps = ReturnType<
  typeof configureStore<
    {
      flower: Record<string, Flower<any>>
    },
    UnknownAction,
    Tuple<
      [
        ThunkMiddleware<
          {
            flower: Record<string, Flower<any>>
          },
          UnknownAction
        >
      ]
    >
  >
>
