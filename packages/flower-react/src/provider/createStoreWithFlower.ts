import {
  combineReducers,
  configureStore as generateStore
} from '@reduxjs/toolkit'
import { reducerFlower } from '../features'
import { middlewares, reducerData } from '@flowerforce/flower-react-store'
import { CreateStoreWithFlower, MiddlewareList } from '../types/middlewares'

export const createStoreWithFlower: CreateStoreWithFlower = (
  configureStore,
  middlewaresBlacklist
) => {
  if (!configureStore) {
    return generateStore({
      reducer: combineReducers({ ...reducerData, ...reducerFlower }),
      devTools: true
    })
  }
  const { reducer, ...configOptions } = configureStore ?? {}
  const combinedReducers = combineReducers({
    ...reducerData,
    ...reducerFlower,
    ...(reducer || {})
  })

  const flowerMiddlewares = middlewaresBlacklist
    ? middlewares.filter(
        (middleware) =>
          !middlewaresBlacklist.includes(middleware.name as MiddlewareList)
      )
    : middlewares

  return generateStore({
    reducer: combinedReducers,
    ...configOptions,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        ...flowerMiddlewares,
        // Here we can insert any number of defaults middleware for flower reducers if needed
        ...((configOptions.middleware as any) ?? [])
        // configOptions.middleware as any
      )
  })
}
