import { reducerData } from '@flowerforce/flower-react-store'
import {
  combineReducers,
  ConfigureStoreOptions,
  configureStore as generateStore
} from '@reduxjs/toolkit'

export const createStoreWithFlowerData = (
  configureStore?: ConfigureStoreOptions
) => {
  if (!configureStore) {
    return generateStore({ reducer: reducerData, devTools: true })
  }
  const { reducer, ...configOptions } = configureStore ?? {}
  const combinedReducers = combineReducers({ ...reducerData, ...reducer })
  return generateStore({
    reducer: combinedReducers,
    ...configOptions,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        // flowerMiddleware,
        // Here we can insert any number of defaults middleware for flower reducers if needed
        ...((configOptions.middleware as any) ?? [])
        // configOptions.middleware as any
      )
  })
}
