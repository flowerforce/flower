import React, { PropsWithChildren } from 'react'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'

const FormProvider = ({ children }: PropsWithChildren) => (
  <ReduxFlowerProvider>{children}</ReduxFlowerProvider>
)

export default FormProvider
