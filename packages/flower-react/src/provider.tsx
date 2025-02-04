import React, { PropsWithChildren, createContext, PureComponent } from 'react'
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue
} from 'react-redux'
import { Action, combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducerFlower } from './reducer'
import { FlowerProviderProps } from './components/types/FlowerProvider'
import { REDUCER_NAME } from '@flowerforce/flower-core'

//TODO check reduxContext type due to remove all any types

const reduxContext = createContext<ReactReduxContextValue<any, Action> | null>(
  null
)

export const useDispatch = createDispatchHook(reduxContext)
export const useSelector = createSelectorHook(reduxContext)
export const useStore = createStoreHook(reduxContext)

export const store = ({ enableDevtool }: { enableDevtool?: boolean }) =>
  configureStore({
    reducer: combineReducers({ ...reducerFlower }),
    devTools: enableDevtool ? { name: REDUCER_NAME.FLOWER_FLOW } : false
  })

class FlowerProvider extends PureComponent<
  PropsWithChildren<{ enableReduxDevtool?: boolean }>,
  FlowerProviderProps
> {
  private store: FlowerProviderProps
  // public injectReducers: (key: string, injectedReducer: Reducer) => void
  constructor(props: PropsWithChildren<{ enableReduxDevtool?: boolean }>) {
    super(props)
    this.store = store({
      enableDevtool: props.enableReduxDevtool
    })
    // this.injectReducers = (key: string, injectedReducer: Reducer) => {
    //   this.store.replaceReducer(
    //     combineReducers({ ...reducerFlower, [key]: injectedReducer })
    //   )
    // }
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

export default FlowerProvider
