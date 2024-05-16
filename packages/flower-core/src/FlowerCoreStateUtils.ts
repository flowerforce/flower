import { get as _get } from 'lodash'
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
    return {
      touched: form?.touched || false,
      errors: form?.errors,
      isValidating: form?.isValidating,
      isValid:
        form && form.errors
          ? Object.values(form.errors).flat().length === 0
          : true
    }
  }
}
