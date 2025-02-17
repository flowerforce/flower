import { CoreUtils } from '../../utils/FlowerCoreUtils'
import { MatchRules } from '../../RulesMatcher'
import { unflatten } from 'flat'
import { createFormData } from '../../utils/FlowerCoreStateUtils'
import { IFormSelectors } from '../../interfaces'
import _get from 'lodash/get'
import { REDUCER_NAME } from '../../constants'

export const FlowerCoreStateDataSelectors: IFormSelectors = {
  selectGlobalReducerByName: (name) => (state) =>
    state[name] ?? state[REDUCER_NAME.FLOWER_DATA][name],
  selectGlobalForm: (state) => {
    return state && state[REDUCER_NAME.FLOWER_DATA]
  },
  // getDataByFlow: (flower) => _get(flower, 'data') ?? {},
  getDataFromState: (id) => (data) => (id === '*' ? data : _get(data, id)),
  makeSelectNodeFormSubmitted: (form) => form && form.isSubmitted,
  makeSelectNodeFormFieldTouched: (id) => (form) =>
    form && form.touches && form.touches[id],
  makeSelectNodeFormFieldFocused: (id) => (form) => {
    return form && form.hasFocus === id ? id : undefined
  },
  makeSelectNodeFormFieldDirty: (id) => (form) =>
    form && form.dirty && form.dirty[id],
  makeSelectNodeErrors: createFormData,

  makeSelectFieldError: (name, id, validate) => (data, form) => {
    const customErrors = Object.entries((form && form.customErrors) || {})
      .filter(([k]) => k === id)
      .map(([, v]) => v)
      .flat()

    if (!validate || !data) return [] as string[]

    const errors = validate.filter((rule) => {
      if (!rule) return true
      if (!rule.rules) return true

      const transformSelf = CoreUtils.mapKeysDeepLodash(rule.rules, (v, key) =>
        key === '$self' ? id : key
      )
      const [hasError] = MatchRules.rulesMatcher(transformSelf, data, false, {
        prefix: name
      })
      return hasError
    })

    const result = errors.map((r) => (r && r.message) || 'error')

    return [...customErrors, ...(result.length === 0 ? [] : result)]
  },

  selectorRulesDisabled: (id, rules, keys, flowName, value) => (data, form) => {
    const newState = { ...data, ...value, $form: form }
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

    const [disabled] = MatchRules.rulesMatcher(
      rules,
      { ...unflatten(res) },
      false,
      { prefix: flowName }
    )

    return disabled
  }
}
