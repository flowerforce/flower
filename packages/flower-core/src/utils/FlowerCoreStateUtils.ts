import _get from 'lodash/get'
import { CoreStateUtils } from '../interfaces/UtilsInterface'

export const FlowerStateUtils: CoreStateUtils = {
  getAllData: (state) =>
    state &&
    Object.entries(state ?? {}).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v?.data ?? v }),
      {}
    ),

  selectFlowerFormNode: (name) => (state) => _get(state, name),

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
    const form = FlowerStateUtils.selectFlowerFormNode(name)(state)

    return createFormData(form)
  }
}

export const createFormData = (form: Record<string, any>) => {
  const validationErrors = form && form.errors

  const allErrors = Object.values(validationErrors || {})

  return {
    isSubmitted: form?.isSubmitted || false,
    isDirty: Object.values(form?.dirty || {}).some(Boolean) || false,
    hasFocus: form?.hasFocus,
    errors: form?.errors,
    customErrors: form?.customErrors,
    isValidating: form?.isValidating,
    isValid: allErrors.flat().length === 0
  }
}
