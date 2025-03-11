import React, { PropsWithChildren, createContext, PureComponent } from 'react'
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue
} from 'react-redux'
import {
  Action,
  combineReducers,
  configureStore,
  ConfigureStoreOptions
} from '@reduxjs/toolkit'
import {
  buildCreateApi,
  coreModule,
  reactHooksModule
} from '@reduxjs/toolkit/query/react'
import {
  ExternalProviderProps,
  REDUCERS_TYPES,
  ReduxProviderProps
} from '../types/reducerTypes'
import { reducerData } from '../reducer/dataReducer'

//TODO check reduxContext type due to remove all any types

const reduxContext = createContext<ReactReduxContextValue<any, Action> | null>(
  null
)

const store = (
  reducers?: REDUCERS_TYPES,
  config?: Omit<ConfigureStoreOptions, 'reducer'>
) => {
  const reducer = combineReducers({
    ...reducerData,
    ...(reducers || {})
  })
  return configureStore({ reducer, ...config })
}

class FlowerStoreProvider extends PureComponent<
  PropsWithChildren<ExternalProviderProps>,
  ExternalProviderProps
> {
  private store: Omit<ReduxProviderProps, 'reducer' | 'config'>
  constructor(props: ExternalProviderProps) {
    super(props)
    const { configureStore } = props
    const { reducer, ...restConfig } = configureStore ?? {}
    this.store = store(reducer, restConfig)
  }

  render() {
    const { children } = this.props
    return (
      <Provider context={reduxContext} store={this.store}>
        {children}
      </Provider>
    )
  }
}

export const useDispatch = createDispatchHook(reduxContext)
export const useSelector = createSelectorHook(reduxContext)
export const useStore = createStoreHook(reduxContext)
export const createMyApi = buildCreateApi(
  coreModule(),
  reactHooksModule({ hooks: { useDispatch, useSelector, useStore } })
)

export const ReduxFlowerProvider = FlowerStoreProvider
