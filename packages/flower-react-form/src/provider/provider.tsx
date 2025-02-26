import React, { PropsWithChildren } from 'react'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { ConfigureStoreOptions } from '@reduxjs/toolkit'

export const FormProvider = ({
  children,
  configureStoreOptions
}: PropsWithChildren<{
  configureStoreOptions?: Omit<ConfigureStoreOptions, 'reducer'>
}>) => (
  <ReduxFlowerProvider config={configureStoreOptions}>
    {children}
  </ReduxFlowerProvider>
)
