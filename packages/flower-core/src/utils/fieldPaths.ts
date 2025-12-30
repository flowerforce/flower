import _get from 'lodash/get'
import { CoreUtils } from '../CoreUtils'

export type FieldPathInfo = {
  flowNameFromPath?: string
  path: string | string[]
  externalPath?: string[]
  isExternal: boolean
}

export const resolveFieldPath = (
  id?: string,
  flowName?: string
): FieldPathInfo => {
  const { path, flowNameFromPath, externalPath } = CoreUtils.getPath(id)
  return {
    flowNameFromPath: flowNameFromPath ?? flowName,
    path,
    externalPath,
    isExternal: Array.isArray(externalPath) && externalPath.length > 0
  }
}

export const readExternalValue = (
  state: Record<string, any>,
  externalPath?: string[]
) => {
  if (!externalPath || !externalPath.length) {
    return undefined
  }
  return _get(state, externalPath, undefined)
}
