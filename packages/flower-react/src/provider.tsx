import React, { PropsWithChildren } from 'react'
import { reducerFlower } from './reducer'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { ConfigureStoreOptions, Reducer } from '@reduxjs/toolkit'

const FlowerProvider = ({
  children,
  enableReduxDevtool,
  configureStoreOptions,
  reducers
}: PropsWithChildren<{
  reducers?: Record<string, Reducer>
  configureStoreOptions?: Omit<ConfigureStoreOptions, 'reducer'>
  /** @deprecated - uses devTools key from configureStoreOptions instead */
  enableReduxDevtool?: boolean
}>) => (
  <ReduxFlowerProvider
    reducer={{ ...reducerFlower, ...(reducers ?? {}) }}
    config={{
      ...configureStoreOptions,
      devTools: enableReduxDevtool ?? configureStoreOptions?.devTools
    }}
  >
    {children}
  </ReduxFlowerProvider>
)

export default FlowerProvider
