import {
  combineReducers,
  configureStore as generateStore
} from '@reduxjs/toolkit'
import { reducerFlower } from '../features'
import { middlewares, reducerData } from '@flowerforce/flower-react-store'
import { CreateStoreWithFlower, MiddlewareList } from '../types/middlewares'

/**
 *
 * @param {ConfigureStoreOptions} configureStore object to configure store - same structure as redux configureStore options
 * @param {MiddlewareList} middlewaresBlacklist list of flower middlewares to blacklist
 * @returns {Store} redux store instance
 */
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

  const flowerMiddlewares =
    middlewaresBlacklist && !!middlewaresBlacklist.length
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
        ...((configOptions.middleware as any) ?? [])
      )
  })
}
