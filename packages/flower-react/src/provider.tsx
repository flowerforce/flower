import React, { PropsWithChildren } from 'react'
import { reducerFlower } from './reducer'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'

const FlowerProvider = ({
  children,
  enableReduxDevtool
}: PropsWithChildren<{ enableReduxDevtool?: boolean }>) => (
  <ReduxFlowerProvider
    reducer={reducerFlower}
    config={{ devTools: enableReduxDevtool }}
  >
    {children}
  </ReduxFlowerProvider>
)

export default FlowerProvider
