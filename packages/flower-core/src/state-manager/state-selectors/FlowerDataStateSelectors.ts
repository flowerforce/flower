import { CoreUtils } from '../../utils/FlowerCoreUtils'
import { unflatten } from 'flat'
import { generateData } from '../../utils/FlowerCoreStateUtils'
import { IDataSelectors } from '../../interfaces'
import _get from 'lodash/get'
import { REDUCER_NAME } from '../../constants'
import { rulesMatcher } from '../../rules-matcher'

export const FlowerCoreStateDataSelectors: IDataSelectors = {
  selectGlobalReducerByName: (name) => (state) =>
    state[name] ?? state[REDUCER_NAME.FLOWER_DATA][name],
  selectGlobalData: (state) => {
    return state && state[REDUCER_NAME.FLOWER_DATA]
  },
  // getDataByFlow: (flower) => _get(flower, 'data') ?? {},
  getDataFromState: (id) => (data) => (id === '*' ? data : _get(data, id)),
  makeSelectNodeDataSubmitted: (data) => data && data.isSubmitted,
  makeSelectNodeDataFieldTouched: (id) => (data) =>
    data && data.touches && data.touches[id],
  makeSelectNodeDataFieldFocused: (id) => (data) => {
    return data && data.hasFocus === id ? id : undefined
  },
  makeSelectNodeDataFieldDirty: (id) => (data) =>
    data && data.dirty && data.dirty[id],
  makeSelectNodeErrors: generateData,

  makeSelectFieldError: (name, id, validate) => (globalData, data) => {
    const customErrors = Object.entries((data && data.customErrors) || {})
      .filter(([k]) => k === id)
      .map(([, v]) => v)
      .flat()

    if (!validate || !globalData) return [] as string[]

    const errors = validate.filter((rule) => {
      if (!rule) return true
      if (!rule.rules) return true

      const transformSelf = CoreUtils.mapKeysDeepLodash(rule.rules, (v, key) =>
        key === '$self' ? id : key
      )
      const [hasError] = rulesMatcher(transformSelf, globalData, false, {
        prefix: name
      })
      return hasError
    })

    const result = errors.map((r) => (r && r.message) || 'error')

    return [...customErrors, ...(result.length === 0 ? [] : result)]
  },

  selectorRulesDisabled:
    (id, rules, keys, flowName, value) => (globalData, data) => {
      const newState = { ...globalData, ...value, $data: data, $form: data }
      const state = Object.assign(
        newState,
        id ? { $self: _get(newState, [flowName, ...id.split('.')]) } : {}
      )

      if (!rules) return false
      if (typeof rules === 'function') {
        return !rules(state)
      }

      if (!keys) return false

      const res = keys.reduce((acc, inc) => {
        const k = inc
        return Object.assign(acc, { [k]: _get(state, k) })
      }, {})

      const [disabled] = rulesMatcher(rules, { ...unflatten(res) }, false, {
        prefix: flowName
      })

      return disabled
    }
}
