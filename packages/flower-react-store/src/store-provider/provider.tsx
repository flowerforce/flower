import React, {
  PropsWithChildren,
  createContext,
  PureComponent,
  Context
} from 'react'
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
  ConfigureStoreOptions,
  Store
} from '@reduxjs/toolkit'
import {
  buildCreateApi,
  coreModule,
  reactHooksModule
} from '@reduxjs/toolkit/query/react'
import { ExternalProviderProps, REDUCERS_TYPES } from '../types/reducerTypes'
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
  private store: Store<any, never, unknown> | null = null
  private reduxContext: any = null

  constructor(props: ExternalProviderProps) {
    super(props)
    if (!FlowerStoreProvider.instance) {
      const { configureStore } = props
      const { reducer, ...restConfig } = configureStore ?? {}
      this.store = createStore(reducer, restConfig)
      this.reduxContext = createContext<ReactReduxContextValue<
        any,
        Action
      > | null>(null)
      FlowerStoreProvider.instance = this
    }
    return FlowerStoreProvider.instance
  }

  private getReduxContext(): Context<ReactReduxContextValue<
    any,
    Action
  > | null> {
    return this?.reduxContext ?? ReactReduxContext
  }

  static createDispatchHook() {
    return createDispatchHook(this.instance?.getReduxContext())
  }

  static createSelectorHook() {
    return createSelectorHook(this.instance?.getReduxContext())
  }

  static createStoreHook() {
    return createStoreHook(this.instance?.getReduxContext())
  }

  static getReduxHooks() {
    return {
      dispatch: this.createDispatchHook()(),
      useSelector: this.createSelectorHook(),
      store: this.createStoreHook()()
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider context={this.reduxContext} store={this.store!}>
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
