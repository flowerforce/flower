import React, { PropsWithChildren } from 'react'
import { reducerFlower } from '../features'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { ConfigureStoreOptions, Reducer, UnknownAction } from '@reduxjs/toolkit'

export const FlowerProvider = <
  T extends Record<string, unknown> = Record<string, unknown>
>({
  children,
  enableReduxDevtool,
  configureStore
}: PropsWithChildren<{
  configureStore?: Omit<ConfigureStoreOptions, 'reducer'> & {
    reducer?:
      | Reducer<T, UnknownAction>
      | { [x: string]: Reducer<T, UnknownAction> }
  }
  /** @deprecated - uses devTools key from configureStoreOptions instead */
  enableReduxDevtool?: boolean
}>) => {
  const { reducer, ...rest } = configureStore ?? {
    devTools: enableReduxDevtool
  }
  return (
    <ReduxFlowerProvider
      configureStore={{
        reducer: { ...reducerFlower, ...(reducer ?? {}) },
        ...rest,
        devTools: enableReduxDevtool ?? rest?.devTools
      }}
    >
      {children}
    </ReduxFlowerProvider>
  )
}
