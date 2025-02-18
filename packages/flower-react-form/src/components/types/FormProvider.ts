import { ThunkMiddleware, Tuple, configureStore } from '@reduxjs/toolkit'
import { Flower, REDUCER_NAME } from '@flowerforce/flower-core' // import from core
import { UnknownAction } from 'redux'

export interface FormProviderInterface {
  render(): JSX.Element
}

export type FormProviderProps = ReturnType<
  typeof configureStore<
    {
      [REDUCER_NAME.FLOWER_DATA]: Record<string, Flower<any>>
    },
    UnknownAction,
    Tuple<
      [
        ThunkMiddleware<
          {
            [REDUCER_NAME.FLOWER_DATA]: Record<string, Flower<any>>
          },
          UnknownAction
        >
      ]
    >
  >
>
