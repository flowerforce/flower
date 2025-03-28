import {
  combineReducers,
  configureStore as generateStore
} from '@reduxjs/toolkit'
import { middlewares, reducerData } from '@flowerforce/flower-react-store'
import { CreateStoreWithFlowerData, MiddlewareList } from '../types'

/**
 *
 * @param {ConfigureStoreOptions} configureStore object to configure store - same structure as redux configureStore options
 * @param {MiddlewareList} middlewaresBlacklist list of flower middlewares to blacklist
 * @returns {Store} redux store instance
 */
export const createStoreWithFlowerData: CreateStoreWithFlowerData = (
  configureStore,
  middlewaresBlacklist
) => {
  if (!configureStore) {
    return generateStore({
      reducer: combineReducers({ ...reducerData }),
      devTools: true
    })
  }
  const { reducer, ...configOptions } = configureStore ?? {}
  const combinedReducers = combineReducers({
    ...reducerData,
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
