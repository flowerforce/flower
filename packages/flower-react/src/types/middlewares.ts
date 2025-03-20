import { ConfigureStoreOptions, Store } from '@reduxjs/toolkit'

export type MiddlewareList = 'flowerMiddleware' | 'none'

type Values<T> = T[keyof T]
type UniqueTuple<U extends string> = [U] extends [never]
  ? []
  : Values<{
      [K in U]: [K, ...UniqueTuple<Exclude<U, K>>]
    }>

export type UniqueMiddlewaresist = UniqueTuple<MiddlewareList>

/**
 * Generates a Redux store instance with flower reducers injected automatically.
 *
 * @param {ConfigureStoreOptions} configureStore - The configuration options for creating the Redux store.
 * @param {MiddlewareList} middlewaresBlacklist - Blacklist of middlewares we don't want to be integrated
 * @returns {Store} A configured REdux store instance with flower reducers
 */
export type CreateStoreWithFlower = (
  configureStore?: ConfigureStoreOptions,
  middlewaresBlacklist?: UniqueMiddlewaresist
) => Store
