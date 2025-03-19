import {
  ConfigureStoreOptions,
  combineReducers,
  configureStore as generateStore
} from '@reduxjs/toolkit'
import { reducerFlower } from '../features'
import { reducerData } from '@flowerforce/flower-react-store'

export const createStoreWithFlower = (
  configureStore?: ConfigureStoreOptions
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
