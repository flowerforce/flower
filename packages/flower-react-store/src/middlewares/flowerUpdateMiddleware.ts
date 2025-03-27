import { CoreUtils } from '@flowerforce/flower-core'
import { generateDataMiddlewares } from './generateMiddlewares'

const { getPath } = CoreUtils

const _flowerUpdateMiddleware = generateDataMiddlewares(
  'FlowerData/addDataByPath',
  (next, action, { getState, dispatch }) => {
    const { payload } = action
    if (payload && payload.id) {
      const state = getState() // Get current state

      const { id, value, ...rest } = payload
      const { path, rootName } = getPath(id)

      const newPath = typeof path === 'string' ? [path] : path

      if (rootName && state[rootName]) {
        dispatch({
          type: `${rootName}/flowerUpdateData`, // You need a reducer in that slice
          payload: {
            path: newPath,
            value
          }
        })

        const newAction: typeof action = {
          type: action.type,
          payload: { id, ...rest }
        }

        return next(newAction)
      }
    }
  }
)

export const flowerUpdateMiddleware = Object.defineProperty(
  _flowerUpdateMiddleware,
  'name',
  { value: 'flowerUpdateMiddleware' }
)
