/* eslint-disable no-useless-escape */
import find from 'lodash/find'
import get from 'lodash/get'
import keyBy from 'lodash/keyBy'
import has from 'lodash/has'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import mapKeys from 'lodash/mapKeys'
import mapValues from 'lodash/mapValues'
import { MatchRules } from '../RulesMatcher'
import { FlowUtilitiesFunctions, GetRulesExists } from '../interfaces'

// TODO align this set of functions to selectors and reducers functions
export const flattenRules = (ob: Record<string, any>) => {
  const result: Record<string, any> = {}

  for (const i in ob) {
    if (ob[i] === null) {
      result[i] = null
    }

    if (
      (typeof ob[i] === 'object' && !Array.isArray(ob[i])) ||
      (Array.isArray(ob[i]) && typeof ob[i][0] === 'object')
    ) {
      const temp = flattenRules(ob[i])

      for (const j in temp) {
        result[i + '*' + j] = temp[j]
      }
    } else {
      result[i] = ob[i]
    }
  }
  return result
}

const getRulesExists: GetRulesExists = (rules) => {
  return Object.keys(rules).length ? FlowUtils.mapEdge(rules) : undefined
}

export const FlowUtils: FlowUtilitiesFunctions = {
  generateRulesName: (nextRules) => {
    return nextRules.reduce((acc, inc) => {
      const n =
        typeof inc.rules === 'string'
          ? inc.rules || '__ERROR_NAME__'
          : inc.rules?.name || '__ERROR_NAME__'
      return {
        ...acc,
        [n]: inc.nodeId
      }
    }, {})
  },

  mapKeysDeepLodash: (obj, cb, isRecursive) => {
    /* istanbul ignore next */
    if (!obj && !isRecursive) {
      return {}
    }

    if (!isRecursive) {
      /* istanbul ignore next */
      if (
        typeof obj === 'string' ||
        typeof obj === 'number' ||
        typeof obj === 'boolean'
      ) {
        return {}
      }
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => FlowUtils.mapKeysDeepLodash(item, cb, true))
    }

    if (!isPlainObject(obj)) {
      return obj
    }

    const result = mapKeys(obj, cb)

    return mapValues(result, (value) =>
      FlowUtils.mapKeysDeepLodash(value, cb, true)
    )
  },

  generateNodes: (nodes) =>
    keyBy(
      nodes.map((s) => omit(s, 'nextRules')),
      'nodeId'
    ),

  makeObjectRules: (nodes) =>
    nodes.reduce((acc, inc) => ({ ...acc, [inc.nodeId!]: inc.nextRules }), {}),

  hasNode: (state, name, node) => has(state, [name, 'nodes', node]),

  isEmptyRules: (rules) => {
    if (isEmpty(rules)) return true
    if (isEmpty(get(rules, 'rules'))) return true
    if (
      Object.keys(flattenRules(rules)).every(
        (key) => key.endsWith('$and') || key.endsWith('$or')
      )
    ) {
      return true
    }
    return false
  },

  mapEdge: (nextNode) => {
    const res = nextNode.sort((a, b) => {
      const x = FlowUtils.isEmptyRules(a.rules)
      const y = FlowUtils.isEmptyRules(b.rules)
      return Number(x) - Number(y)
    })
    return res
  },

  makeRules: (rules) =>
    Object.entries(rules).reduce<any>(
      (acc2, [k, v]) => [...acc2, { nodeId: k, rules: v }],
      []
    ),

  generateNodesForFlowerJson: (nodes) =>
    nodes
      .filter((e) => !!get(e, 'props.id'))
      .map((e) => {
        const rules = FlowUtils.makeRules(e.props.to ?? {})
        const nextRules = getRulesExists(rules)
        const children = e.props.data?.children
        return {
          nodeId: e.props.id,
          nodeType: e.type.displayName || e.props.as || 'FlowerNode',
          nodeTitle: get(e.props, 'data.title'),
          children,
          nextRules,
          retain: e.props.retain,
          disabled: e.props.disabled
        }
      }),

  allEqual: (arr, arr2) =>
    arr.length === arr2.length && arr.every((v) => arr2.includes(v)),

  findValidRule: (nextRules, value, prefix) =>
    find(nextRules, (rule) => {
      // fix per evitare di entrare in un nodo senza regole, ma con un name,
      // invocando un next() senza paramentri
      if (typeof rule.rules === 'string') {
        return false
      }

      if (typeof rule.rules === 'function') {
        return rule.rules(value) as boolean
      }

      if (rule.rules === null) {
        return true
      }

      if (typeof rule.rules?.rules === 'undefined') {
        return false
      }

      if (typeof rule.rules.rules === 'string') {
        return false
      }

      const [valid] = MatchRules.rulesMatcher(rule.rules.rules, value, true, {
        prefix
      })
      return valid
    })
}
