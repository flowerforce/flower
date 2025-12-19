import { combineReducers, Reducer } from '@reduxjs/toolkit'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import { produce } from 'immer'
import { CoreUtils } from '@flowerforce/flower-core'
import { reducerFlower } from './reducer'

type ExternalReducers = Record<string, Reducer<any, any>>

const normalizePath = (path: string | string[] | undefined) => {
  if (Array.isArray(path)) {
    return path
  }
  if (path === '*') {
    return []
  }
  if (path) {
    return [path]
  }
  return []
}

export const createFlowerRootReducer = (externalReducers: ExternalReducers) => {
  const rootReducer = combineReducers({
    ...externalReducers,
    ...reducerFlower
  })

  type RootState = ReturnType<typeof rootReducer>

  const applyExternalValue = (
    state: RootState | undefined,
    payload: any
  ): RootState | undefined => {
    if (!payload?.id || !state) {
      return state
    }
    const { path, flowNameFromPath } = CoreUtils.getPath(payload.id)
    if (!flowNameFromPath) {
      return state
    }
    if (
      !Object.prototype.hasOwnProperty.call(externalReducers, flowNameFromPath)
    ) {
      return state
    }

    const key = flowNameFromPath as keyof RootState
    const segments = normalizePath(path)

    return produce(state, (draft) => {
      if (segments.length === 0) {
        draft[key] = payload.value
        return
      }

      const target = draft[key] ?? {}
      _set(target, segments, payload.value)
      draft[key] = target
    })
  }

  const applyExternalUnset = (
    state: RootState | undefined,
    payload: any
  ): RootState | undefined => {
    if (!payload?.flowName || !payload?.id || !state) {
      return state
    }
    if (
      !Object.prototype.hasOwnProperty.call(externalReducers, payload.flowName)
    ) {
      return state
    }

    const key = payload.flowName as keyof RootState
    const segments = Array.isArray(payload.id) ? payload.id : [payload.id]
    if (!segments.length) {
      return state
    }

    return produce(state, (draft) => {
      const target = (draft[key] ?? {}) as Record<string, any>
      _unset(target, segments)
      draft[key] = target
    })
  }

  return (state: RootState | undefined, action: any) => {
    let patchedState = state

    if (action.type === 'flower/addDataByPath') {
      patchedState = applyExternalValue(patchedState, action.payload)
    } else if (action.type === 'flower/unsetData') {
      patchedState = applyExternalUnset(patchedState, action.payload)
    }

    return rootReducer(patchedState, action)
  }
}
