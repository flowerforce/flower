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
import { FlowerStore } from './components/types/FlowerProvider'

//TODO check reduxContext type due to remove all any types

const reduxContext = createContext<ReactReduxContextValue<any, Action> | null>(
  null
)

export const useDispatch = createDispatchHook(reduxContext) // exported
export const useSelector = createSelectorHook(reduxContext)
export const useStore = createStoreHook(reduxContext)

export const createFlowerStore = ({
  enableDevtool
}: {
  enableDevtool?: boolean
}) =>
  configureStore({
    reducer: reducerFlower,
    devTools: enableDevtool ? { name: 'flower' } : false
  })

type FlowerProviderComponentProps = PropsWithChildren<{
  enableReduxDevtool?: boolean
  store?: FlowerStore
}>

class FlowerProvider extends PureComponent<FlowerProviderComponentProps> {
  private readonly store: FlowerStore

  constructor(props: FlowerProviderComponentProps) {
    super(props)
    this.store =
      props.store ??
      createFlowerStore({ enableDevtool: props.enableReduxDevtool })
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
