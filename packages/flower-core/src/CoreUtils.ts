/* eslint-disable no-useless-escape */
import {
  find,
  get,
  keyBy,
  has,
  omit,
  isEmpty,
  isPlainObject,
  mapKeys,
  mapValues,
  trimStart
} from 'lodash'
import { MatchRules } from './RulesMatcher'
import {
  CoreUtilitiesFunctions,
  GetRulesExists
} from './interfaces/CoreInterface'

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

// export const searchEmptyKeyRecursively = <T extends object>(
//   _key: "$and" | "$or",
//   obj: T
// ) => {
//   if (
//     isEmpty(obj) ||
//     typeof obj !== "object" ||
//     Object.keys(obj).length === 0
//   ) {
//     return true;
//   }

//   if (Object.keys(obj).includes(_key)) {
//     if (obj[_key] && obj[_key].length === 0) return true;
//     return Object.keys(obj).map((key) =>
//       searchEmptyKeyRecursively(_key, obj[key])
//     );
//   }
//   return Object.keys(obj)
//     .map((key) => searchEmptyKeyRecursively(_key, obj[key]))
//     .every((v) => v === true);
// };

const getRulesExists: GetRulesExists = (rules) => {
  return Object.keys(rules).length ? CoreUtils.mapEdge(rules) : undefined
}
/**
 * Defines a collection of utility functions for processing rules, nodes and graph-like structures
 */
export const CoreUtils: CoreUtilitiesFunctions = {
  generateRulesName: (nextRules) => {
    const a = nextRules.reduce((acc, inc) => {
      const n =
        typeof inc.rules === 'string'
          ? inc.rules
          : inc.rules?.name || '__ERROR_NAME__'
      return {
        ...acc,
        [n]: inc.nodeId
      }
    }, {})
    return a
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
      return obj.map((item) => CoreUtils.mapKeysDeepLodash(item, cb, true))
    }

    if (!isPlainObject(obj)) {
      return obj
    }

    const result = mapKeys(obj, cb)

    return mapValues(result, (value) =>
      CoreUtils.mapKeysDeepLodash(value, cb, true)
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
      const x = CoreUtils.isEmptyRules(a.rules)
      const y = CoreUtils.isEmptyRules(b.rules)
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
    nodes.map((e) => {
      const rules = CoreUtils.makeRules(e.props.to ?? {})
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

  cleanPath: (name: string, char = '^') => trimStart(name, char),

  getPath: (idValue?: string) => {
    if (!idValue) {
      return {
        path: []
      }
    }

    if (idValue === '*') {
      return {
        path: '*'
      }
    }

    if (idValue.indexOf('^') === 0) {
      const [flowNameFromPath, ...rest] =
        CoreUtils.cleanPath(idValue).split('.')
      return {
        flowNameFromPath,
        path: rest
      }
    }

    return {
      path: idValue.split('.')
    }
  },
  allEqual: (arr, arr2) =>
    arr.length === arr2.length && arr.every((v) => arr2.includes(v)),

  findValidRule: (nextRules, value, prefix) =>
    find(nextRules, (rule) => {
      // fix per evitare di entrare in un nodo senza regole, ma con un name,
      // invocando un onNext() senza paramentri
      if (typeof rule.rules === 'string') {
        return false
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
