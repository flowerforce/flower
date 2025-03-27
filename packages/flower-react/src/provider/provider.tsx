import React, { PropsWithChildren } from 'react'
import { reducerFlower } from '../features'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { ConfigureStoreOptions } from '@reduxjs/toolkit'

export const FlowerProvider = ({
  children,
  enableReduxDevtool,
  configureStore
}: PropsWithChildren<{
  configureStore?: ConfigureStoreOptions
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
