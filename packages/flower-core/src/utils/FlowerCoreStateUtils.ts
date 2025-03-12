import _get from 'lodash/get'
import { CoreStateUtils } from '../interfaces/UtilsInterface'

export const FlowerStateUtils: CoreStateUtils = {
  getAllData: (state) =>
    state &&
    Object.entries(state ?? {}).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v?.data ?? v }),
      {}
    ),

  selectFlowerDataNode: (name) => (state) => _get(state, name),

  makeSelectCurrentNextRules: (name) => (state) => {
    const nextRules = _get(state, [name, 'nextRules'])
    const currentNodeId = FlowerStateUtils.makeSelectCurrentNodeId(name)(state)
    return _get(nextRules, [currentNodeId])
  },

  makeSelectCurrentNodeId: (name) => (state) => {
    const subState = _get(state, [name])
    const startId = _get(state, ['startId'])
    return _get(subState, ['current']) || startId
  },

  makeSelectNodeErrors: (name) => (state) => {
    const data = FlowerStateUtils.selectFlowerDataNode(name)(state)

    return generateData(data)
  }
}

export const generateData = (data: Record<string, any>) => {
  const validationErrors = data && data.errors

  const allErrors = Object.values(validationErrors || {})

  return {
    isSubmitted: data?.isSubmitted || false,
    isDirty: Object.values(data?.dirty || {}).some(Boolean) || false,
    hasFocus: data?.hasFocus,
    errors: data?.errors,
    customErrors: data?.customErrors,
    isValidating: data?.isValidating,
    isValid: allErrors.flat().length === 0
  }
}
