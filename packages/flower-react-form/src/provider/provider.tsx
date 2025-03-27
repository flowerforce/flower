import React, { PropsWithChildren } from 'react'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { ConfigureStoreOptions } from '@reduxjs/toolkit'

export const FormProvider = ({
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
        reducer: { ...(reducer ?? {}) },
        ...rest,
        devTools: enableReduxDevtool ?? rest?.devTools
      }}
    >
      {children}
    </ReduxFlowerProvider>
  )
}
