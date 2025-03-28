import { ConfigureStoreOptions, Store } from '@reduxjs/toolkit'

export type MiddlewareList = 'flowerUpdateMiddleware'

export type CreateStoreWithFlowerData = (
  configureStore?: ConfigureStoreOptions,
  middlewaresBlacklist?: Array<MiddlewareList>
) => Store
