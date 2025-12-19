import { CoreUtils, Node } from '@flowerforce/flower-core'
import _get from 'lodash/get'

const normalizePathSegments = (
  path: string | string[] | undefined
): string[] => {
  if (Array.isArray(path)) {
    return path
  }
  if (path === '*') {
    return []
  }
  if (path) {
    return [path]
  }
  return []
}

export const createExternalFieldSelector =
  (flowNameFromPath: string | undefined, pathSegments: string[]) =>
  (state: any) => {
    if (!flowNameFromPath) {
      return undefined
    }
    const hasFlowerFlow =
      state &&
      state.flower &&
      Object.prototype.hasOwnProperty.call(state.flower, flowNameFromPath)
    const basePath = hasFlowerFlow
      ? ['flower', flowNameFromPath, 'data']
      : [flowNameFromPath]
    return _get(state, [...basePath, ...pathSegments])
  }

export const getFieldPathInfo = (path: string | string[] | undefined) =>
  normalizePathSegments(path)

// eslint-disable-next-line import/prefer-default-export
export const convertElements = (nodes: Node[]) => {
  const res = CoreUtils.generateNodesForFlowerJson(nodes)
  return res
}
