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
import { registerExternalReducers } from '@flowerforce/flower-core'

const applyExternalUpdate = (state: any, action: UnknownAction) => {
  const { path, value } = (action.payload as FlowerExternalPayload) ?? {}
  if (!Array.isArray(path) || path.length === 0) {
    return state
  }
  return produce(state, (draft: any) => {
    set(draft, path, value)
  })
}

const attachExternalSnapshot = (state: any) => {
  if (!state) return state
  const { flower, ...rest } = state
  return {
    ...state,
    flower: {
      ...flower,
      __external: rest
    }
  }
}

const wrapReducerWithExternal = (reducer: Reducer<any, UnknownAction>) => (
  state: any,
  action: UnknownAction
) => {
  const stateWithSnapshot = attachExternalSnapshot(state)
  if (action.type === FLOWER_EXTERNAL_UPDATE) {
    const patchedState = applyExternalUpdate(stateWithSnapshot, action)
    const nextState = reducer(patchedState, action)
    return attachExternalSnapshot(nextState)
  }
  const nextState = reducer(stateWithSnapshot, action)
  return attachExternalSnapshot(nextState)
}

type FlowerStoreOptions = Omit<
  ConfigureStoreOptions<any, UnknownAction>,
  'reducer'
> & {
  reducer?: ReducersMapObject<any, UnknownAction>
}

export const createFlowerStore = (options: FlowerStoreOptions) => {
  const { reducer, ...rest } = options
  const reducerMap =
    (reducer as ReducersMapObject<any, UnknownAction>) ?? {}

  registerExternalReducers(
    Object.keys(reducerMap).filter((name) => name !== 'flower')
  )

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
