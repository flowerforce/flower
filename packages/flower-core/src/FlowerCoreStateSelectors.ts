import _get from 'lodash/get'
import { ISelectors } from './interfaces/SelectorsInterface'
import { CoreUtils } from './CoreUtils'
import { MatchRules } from './RulesMatcher'
import { unflatten } from 'flat'

export const FlowerCoreStateSelectors: ISelectors = {
  selectGlobal: (state) => state && state.flower,
  selectFlower: (name) => (state) => _get(state, [name]),
  selectFlowerFormNode: (id) => (state) => _get(state, ['form', id]),
  selectFlowerHistory: (flower) => _get(flower, ['history'], []),
  makeSelectNodesIds: (flower) => _get(flower, ['nodes']),
  makeSelectStartNodeId: (flower) => _get(flower, ['startId']),
  getDataByFlow: (flower) => _get(flower, ['data']) ?? {},
  getDataFromState: (id) => (data) => (id === '*' ? data : _get(data, id)),
  makeSelectNodeFormTouched: (form) => form && form.touched,
  makeSelectCurrentNodeId: (flower, startNodeId) =>
    _get(flower, ['current']) || startNodeId,
  makeSelectCurrentNodeDisabled: (nodes, current) =>
    !!_get(nodes, [current, 'disabled']),
  makeSelectPrevNodeRetain: (nodes, history, current) => {
    if (!nodes) return
    const prevFlowerNode = [...history].reverse().find((el) => {
      const { nodeType, retain } = nodes[el]
      return nodeType === 'FlowerNode' || retain
    })
    // eslint-disable-next-line consistent-return
    if (nodes[current].nodeType === 'FlowerNode' || nodes[current].retain)
      return
    if (!prevFlowerNode) return
    if (nodes[prevFlowerNode] && nodes[prevFlowerNode].disabled) return
    // eslint-disable-next-line consistent-return
    return (
      nodes[prevFlowerNode] && nodes[prevFlowerNode].retain && prevFlowerNode
    )
  },
  makeSelectNodeErrors: (form) => {
    return {
      touched: form?.touched || false,
      errors: form?.errors,
      isValidating: form?.isValidating,
      isValid:
        form && form.errors
          ? Object.values(form.errors).flat().length === 0
          : true
    }
  },

  makeSelectFieldError: (name, id, validate) => (data) => {
    if (!validate || !data) return []

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

    return result.length === 0 ? [] : result
  },

  selectorRulesDisabled: (id, rules, keys, flowName, value) => (data, form) => {
    const newState = { ...data, ...value, $form: form }
    const state = Object.assign(
      newState,
      id ? { $self: _get(newState, [flowName, ...id.split('.')]) } : {}
    )

    if (!rules) return false
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
