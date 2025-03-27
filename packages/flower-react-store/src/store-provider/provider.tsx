import React, { PropsWithChildren, createContext, PureComponent } from 'react'
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue,
  ReactReduxContext
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

const createStore = (
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
  private static instance: FlowerStoreProvider | null = null
  private store: Omit<ReduxProviderProps, 'reducer' | 'config'> | null = null
  static reduxContext: any = null

  constructor(props: ExternalProviderProps) {
    super(props)
    if (!FlowerStoreProvider.instance) {
      const { configureStore } = props
      const { reducer, ...restConfig } = configureStore ?? {}
      this.store = createStore(reducer, restConfig)
      FlowerStoreProvider.reduxContext = createContext<ReactReduxContextValue<
        any,
        Action
      > | null>(null)
      FlowerStoreProvider.instance = this
    }
    return FlowerStoreProvider.instance
  }

  public static createDispatchHook() {
    return createDispatchHook(
      FlowerStoreProvider.reduxContext ?? ReactReduxContext
    )
  }

  public static createSelectorHook() {
    return createSelectorHook(
      FlowerStoreProvider.reduxContext ?? ReactReduxContext
    )
  }

  public static createStoreHook() {
    return createStoreHook(
      FlowerStoreProvider.reduxContext ?? ReactReduxContext
    )
  }

  public static getReduxHooks() {
    return {
      dispatch: this.createDispatchHook()(),
      useSelector: this.createSelectorHook(),
      store: this.createStoreHook()()
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider context={FlowerStoreProvider.reduxContext} store={this.store!}>
        {children}
      </Provider>
    )
  }
}

const useDispatch = FlowerStoreProvider.createDispatchHook()
const useSelector = FlowerStoreProvider.createSelectorHook()
const useStore = FlowerStoreProvider.createStoreHook()

export const createApi = buildCreateApi(
  coreModule(),
  reactHooksModule({ hooks: { useDispatch, useSelector, useStore } })
)

export const ReduxFlowerProvider = FlowerStoreProvider
