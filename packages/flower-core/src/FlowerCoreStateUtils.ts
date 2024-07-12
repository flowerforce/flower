import _get from 'lodash/get'
import { CoreStateUtils } from './interfaces/UtilsInterface'

export const FlowerStateUtils: CoreStateUtils = {
  getAllData: (state) =>
    state &&
    Object.entries(state ?? {}).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v.data }),
      {}
    ),

  selectFlowerFormNode: (name, id) => (state) =>
    _get(state, [name, 'form', id]),

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

  makeSelectNodeErrors: (name, currentNodeId) => (state) => {
    const form = FlowerStateUtils.selectFlowerFormNode(
      name,
      currentNodeId
    )(state)

    // DUPLICATO
    const validationErrors = form && form.errors
    const customErrors = form && form.customErrors
    const allErrors = { ...(validationErrors || {}), ...(customErrors || {}) }

    return {
      touched: form?.touched || false,
      errors: form?.errors,
      customErrors: form?.customErrors,
      isValidating: form?.isValidating,
      isValid: allErrors ? Object.values(allErrors).flat().length === 0 : true
    }
  }
}
