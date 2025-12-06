import React, { PropsWithChildren, createContext, PureComponent } from 'react'
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue
} from 'react-redux'
import { Action, configureStore } from '@reduxjs/toolkit'
import { reducerFlower } from './reducer'
import { FlowerProviderProps } from './components/types/FlowerProvider'

//TODO check reduxContext type due to remove all any types

const reduxContext = createContext<ReactReduxContextValue<any, Action> | null>(
  null
)

export const useDispatch = createDispatchHook(reduxContext) // exported
export const useSelector = createSelectorHook(reduxContext)
export const useStore = createStoreHook(reduxContext)

export const store = ({ enableDevtool }: { enableDevtool?: boolean }) =>
  configureStore({
    reducer: reducerFlower,
    devTools: enableDevtool ? { name: 'flower' } : false
  })

class FlowerProvider extends PureComponent<
  PropsWithChildren<{ enableReduxDevtool?: boolean }>,
  FlowerProviderProps
> {
  private store: FlowerProviderProps
  constructor(props: PropsWithChildren<{ enableReduxDevtool?: boolean }>) {
    super(props)
    this.store = store({ enableDevtool: props.enableReduxDevtool })
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
