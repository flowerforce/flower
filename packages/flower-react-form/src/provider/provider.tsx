import React, { PropsWithChildren, Reducer } from 'react'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { ConfigureStoreOptions, UnknownAction } from '@reduxjs/toolkit'

export const FormProvider = <
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
        reducer: { ...(reducer ?? {}) },
        ...rest,
        devTools: enableReduxDevtool ?? rest?.devTools
      }}
    >
      {children}
    </ReduxFlowerProvider>
  )
}
