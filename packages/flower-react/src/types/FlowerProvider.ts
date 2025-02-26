import { ThunkMiddleware, Tuple, configureStore } from '@reduxjs/toolkit'
import { Flower, REDUCER_NAME } from '@flowerforce/flower-core'
import { UnknownAction } from 'redux'

export interface FlowerProviderInterface {
  render(): JSX.Element
}

export type FlowerProviderProps = ReturnType<
  typeof configureStore<
    {
      [REDUCER_NAME.FLOWER_FLOW]: Record<string, Flower<any>>
    },
    UnknownAction,
    Tuple<
      [
        ThunkMiddleware<
          {
            [REDUCER_NAME.FLOWER_FLOW]: Record<string, Flower<any>>
          },
          UnknownAction
        >
      ]
    >
  >
>
