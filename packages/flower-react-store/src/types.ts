import {
  ConfigureStoreOptions,
  Reducer,
  ThunkMiddleware,
  Tuple,
  configureStore
} from '@reduxjs/toolkit'
import { Flower, REDUCER_NAME } from '@flowerforce/flower-core' // import from core
import { UnknownAction } from 'redux'

export interface FormProviderInterface {
  render(): JSX.Element
}

export type REDUCERS_TYPES = Partial<
  Record<
    REDUCER_NAME,
    | Reducer<Record<string, Record<string, unknown>>>
    | Reducer<Record<string, Flower<Record<string, unknown>>>>
  >
>

export type ReduxProviderProps<T = REDUCERS_TYPES> = ReturnType<
  typeof configureStore<
    T,
    UnknownAction,
    Tuple<[ThunkMiddleware<T, UnknownAction>]>
  >
> &
  ExternalProviderProps<T>

export type ExternalProviderProps<T = REDUCERS_TYPES> = {
  reducer?: REDUCERS_TYPES
  config?: Omit<ConfigureStoreOptions<T>, 'reducer'>
}
