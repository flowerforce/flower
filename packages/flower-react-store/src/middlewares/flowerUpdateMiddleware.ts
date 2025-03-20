import { CoreUtils } from '@flowerforce/flower-core'
import { Middleware } from '@reduxjs/toolkit'

const { getPath } = CoreUtils

export const flowerUpdateMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action?.type?.startsWith('FlowerData/addDataByPath')) {
      const { payload } = action

      if (payload && payload.id) {
        const state = store.getState() // Get current state

        const { id, value, ...rest } = payload
        const { path, rootName } = getPath(id)

        const newPath = typeof path === 'string' ? [path] : path

        if (rootName && state[rootName]) {
          store.dispatch({
            type: `${rootName}/flowerUpdateData`, // You need a reducer in that slice
            payload: {
              path: newPath,
              value
            }
          })
          const newAction = {
            type: action.type,
            payload: { id: id.replace(/^\^.*?\./, ''), ...rest }
          }
          next(newAction)
          return
        }
      }
    }

    return next(action) // Pass the original action down the middleware chain
  }
