import {
  combineReducers,
  configureStore as configureReduxStore,
  UnknownAction,
  type ConfigureStoreOptions,
  type Reducer,
  type ReducersMapObject
} from '@reduxjs/toolkit'
import { produce } from 'immer'
import set from 'lodash/set'
import { FLOWER_EXTERNAL_UPDATE, FlowerExternalPayload } from './externalState'
import flowerReducer from './reducer'

const applyExternalUpdate = (state: any, action: UnknownAction) => {
  const { path, value } = (action.payload as FlowerExternalPayload) ?? {}
  if (!Array.isArray(path) || path.length === 0) {
    return state
  }
  return produce(state, (draft: any) => {
    set(draft, path, value)
  })
}

const wrapReducerWithExternal = (reducer: Reducer<any, UnknownAction>) => (
  state: any,
  action: UnknownAction
) => {
  if (action.type === FLOWER_EXTERNAL_UPDATE) {
    const patchedState = applyExternalUpdate(state, action)
    const nextState = reducer(patchedState, action)
    return applyExternalUpdate(nextState, action)
  }
  return reducer(state, action)
}

export const createFlowerStore = (
  options: ConfigureStoreOptions<any, UnknownAction>
) => {
  const { reducer, ...rest } = options
  const reducerMap = reducer as ReducersMapObject<any, UnknownAction>

  const rootReducerMap: ReducersMapObject<any, UnknownAction> = {
    flower: flowerReducer,
    ...reducerMap
  }

  const rootReducer = combineReducers(rootReducerMap) as Reducer<any, UnknownAction>

  return configureReduxStore({
    ...rest,
    reducer: wrapReducerWithExternal(rootReducer)
  })
}
