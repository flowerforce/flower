import {
  DataCaseReducersNames,
  DataReducersFunctions,
  FlowCaseReducersNames,
  CoreReducersFunctions,
  REDUCER_NAME
} from '@flowerforce/flower-core'
import { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit'

type DataAction = {
  type: `${REDUCER_NAME.FLOWER_DATA}/${DataCaseReducersNames}`
  payload: any
}

export const generateDataMiddlewares =
  <
    T extends `${REDUCER_NAME.FLOWER_DATA}/${DataCaseReducersNames}`,
    A extends DataAction = DataAction
  >(
    actionType: T,
    cb: (
      next: Dispatch<DataAction>,
      action: DataAction,
      middlewareApis: MiddlewareAPI<Dispatch<AnyAction>, any>
    ) => DataAction | void
  ) =>
  (middlewareApi: MiddlewareAPI<Dispatch<AnyAction>, any>) =>
  (next: Dispatch<DataAction>) =>
  (action: A) => {
    if (action.type === actionType) {
      const rootAction = action.type.split('/')[1] as DataCaseReducersNames
      const { payload } = action as unknown as Parameters<
        DataReducersFunctions[typeof rootAction]
      >[1]
      return cb(next, { type: actionType, payload }, middlewareApi)
    }
    return next(action)
  }

type FlowAction = {
  type: `${REDUCER_NAME.FLOWER_FLOW}/${FlowCaseReducersNames}`
  payload: any
}

export const generateFlowMiddlewares =
  <T extends FlowAction['type'], A extends FlowAction = FlowAction>(
    actionType: T,
    cb: (
      next: Dispatch<FlowAction>,
      action: FlowAction,
      middlewareApis: MiddlewareAPI<Dispatch<AnyAction>, any>
    ) => FlowAction | void
  ) =>
  (middlewareApi: MiddlewareAPI<Dispatch<AnyAction>, any>) =>
  (next: Dispatch<FlowAction>) =>
  (action: A) => {
    if (action.type === actionType) {
      const rootAction = action.type.split('/')[1] as FlowCaseReducersNames
      const { payload } = action as unknown as Parameters<
        CoreReducersFunctions[typeof rootAction]
      >[1]
      return cb(next, { type: actionType, payload }, middlewareApi)
    }
    return next(action)
  }
