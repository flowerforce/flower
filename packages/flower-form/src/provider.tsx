import React, { PropsWithChildren, createContext, PureComponent } from 'react'
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue
} from 'react-redux'
import { Action, configureStore, Reducer } from '@reduxjs/toolkit'
import { reducerForm } from './reducer'
import { FormProviderProps } from './components/types/FormProvider'
import { REDUCER_NAME } from '@flowerforce/flower-core'

//TODO check reduxContext type due to remove all any types

const reduxContext = createContext<ReactReduxContextValue<any, Action> | null>(
  null
)

export const useDispatch = createDispatchHook(reduxContext)
export const useSelector = createSelectorHook(reduxContext)
export const useStore = createStoreHook(reduxContext)

export const store = ({
  initialState
}: {
  initialState?: Record<string, any>
}) =>
  configureStore<{ [REDUCER_NAME.FLOWER_DATA]: Record<string, any> }>({
    reducer: reducerForm,
    preloadedState: initialState
      ? {
          [REDUCER_NAME.FLOWER_DATA]: { injectedData: initialState }
        }
      : undefined
  })

class FormProvider extends PureComponent<
  PropsWithChildren<{
    initialState?: typeof reducerForm
  }>,
  FormProviderProps
> {
  private store: FormProviderProps
  constructor(
    props: PropsWithChildren<{ initialState?: Record<string, any> }>
  ) {
    super(props)
    this.store = store({ initialState: props.initialState })
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

export default FormProvider
