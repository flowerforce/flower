import React, { PropsWithChildren, createContext, PureComponent } from 'react'
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue
} from 'react-redux'
import { Action } from '@reduxjs/toolkit'
import { createFlowerStore } from './createFlowerStore'
import {
  FlowerProviderOptions,
  FlowerProviderStore
} from './components/types/FlowerProvider'

//TODO check reduxContext type due to remove all any types

const reduxContext = createContext<ReactReduxContextValue<any, Action> | null>(
  null
)

export const useDispatch = createDispatchHook(reduxContext) // exported
export const useSelector = createSelectorHook(reduxContext)
export const useStore = createStoreHook(reduxContext)

export const store = ({
  enableDevtool
}: {
  enableDevtool?: boolean
}): FlowerProviderStore => {
  return createFlowerStore({
    devTools: enableDevtool ? { name: 'flower' } : false
  })
}

class FlowerProvider extends PureComponent<PropsWithChildren<FlowerProviderOptions>> {
  private storeInstance?: FlowerProviderStore

  render() {
    const { children, store: providedStore } = this.props
    const currentStore =
      providedStore ?? this.storeInstance ?? this.getStore()

    return (
      <Provider context={reduxContext} store={currentStore}>
        {children}
      </Provider>
    )
  }

  private getStore(): FlowerProviderStore {
    if (!this.storeInstance) {
      this.storeInstance = store({
        enableDevtool: this.props.enableReduxDevtool
      })
    }
    return this.storeInstance
  }
}

export default FlowerProvider
