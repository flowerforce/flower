import { produce } from 'immer'
import type { UnknownAction } from '@reduxjs/toolkit'
import {
  Flower,
  FlowerCoreReducers,
  type ActionWithPayload
} from '@flowerforce/flower-core'

const FLOWER_SLICE_NAME = 'flower'

export type FlowerState = Record<string, Flower<Record<string, any>>>

const initialState: FlowerState = {}

type FlowerReducerCases = keyof typeof FlowerCoreReducers
type FlowerActionPayload<Key extends FlowerReducerCases> = Parameters<
  typeof FlowerCoreReducers[Key]
>[1]['payload']

type FlowerActionCreators = {
  [Key in FlowerReducerCases]: (
    payload: FlowerActionPayload<Key>
  ) => {
    type: string
    payload: FlowerActionPayload<Key>
  }
}

export const actions = {} as FlowerActionCreators

const assignActionCreator = <Key extends FlowerReducerCases>(key: Key) => {
  actions[key] = ((payload: FlowerActionPayload<Key>) => ({
    type: `${FLOWER_SLICE_NAME}/${key}`,
    payload
  })) as FlowerActionCreators[Key]
}

;(Object.keys(FlowerCoreReducers) as FlowerReducerCases[]).forEach((key) =>
  assignActionCreator(key)
)

const getReducerKey = (actionType: string): FlowerReducerCases | undefined => {
  if (!actionType.startsWith(`${FLOWER_SLICE_NAME}/`)) return undefined
  const key = actionType.slice(FLOWER_SLICE_NAME.length + 1)
  if (key in FlowerCoreReducers) {
    return key as FlowerReducerCases
  }
  return undefined
}

const flowerReducer = (
  state: FlowerState = initialState,
  action: UnknownAction
): FlowerState => {
  const reducerKey = getReducerKey(action.type)
  if (!reducerKey) return state
  return produce<FlowerState>(state, (draft) => {
    FlowerCoreReducers[reducerKey](
      draft,
      action as ActionWithPayload<any>
    )
  })
}

export const reducerFlower = {
  flower: flowerReducer
}

export default flowerReducer
