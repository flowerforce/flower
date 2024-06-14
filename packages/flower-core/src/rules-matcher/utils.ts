import _get from 'lodash/get'
import _trimStart from 'lodash/trimStart'
import _intersection from 'lodash/intersection'
import _isEmpty from 'lodash/isEmpty'
import { Operators } from './interface'
import { RulesMatcherUtils } from './interface'
import { RulesObject } from '../interfaces/CoreInterface'

const EMPTY_STRING_REGEXP = /^\s*$/

/**
 * Defines a utility object named rulesMatcherUtils, which contains various helper functions used for processing rules and data in a rule-matching context.
 */
const rulesMatcherUtils: RulesMatcherUtils = {
  isNumber: (el) => {
    const num = String(el)
    return !!num.match(/(^-?|^\d+\.)\d+$/)
  },
  rule: (val, data, options) => {
    const { prefix } = options || {}
    const path = Object.keys(val)[0]
    const valueBlock = val
    const pathWithPrefix = rulesMatcherUtils.getPath(path, prefix)
    const valueForKey = _get(data, pathWithPrefix, undefined)
    const { name } = _get(valueBlock, [path], {}) || {}
    const { op, value, opt } = rulesMatcherUtils.getDefaultRule(
      valueBlock[path]
    )

    const valueRef =
      value && String(value).indexOf('$ref:') === 0
        ? _get(
            data,
            rulesMatcherUtils.getPath(value.replace('$ref:', ''), prefix),
            undefined
          )
        : value

    if (!operators[op]) {
      throw new Error(`Error missing operator:${op}`)
    }

    const valid =
      operators[op] && operators[op](valueForKey, valueRef, opt, data)
    return { valid, name: `${pathWithPrefix}___${name || op}` }
  },

  getKey: (block: RulesObject, keys, options) => {
    if (_isEmpty(block)) return
    if (Object.prototype.hasOwnProperty.call(block, '$and')) {
      return _get(block, ['$and']).map((item: any) =>
        rulesMatcherUtils.getKey(item, keys, options)
      )
    }
    if (Object.prototype.hasOwnProperty.call(block, '$or')) {
      return _get(block, ['$or']).map((item: any) =>
        rulesMatcherUtils.getKey(item, keys, options)
      )
    }

    const { prefix } = options || {}
    const path = Object.keys(block)[0]
    const valueBlock = _get(block, [path])
    const res = rulesMatcherUtils.getPath(path, prefix)
    const { value } = rulesMatcherUtils.getDefaultRule(valueBlock)

    if (value && String(value).indexOf('$ref:') === 0) {
      keys[rulesMatcherUtils.getPath(value.replace('$ref:', ''), prefix)] = true
    }

    return (keys[res] = true)
  },
  isDate: (v) => v instanceof Date,
  isDefined: (v) => v !== null && v !== undefined,
  isObject: (v) => v === Object(v),
  isFunction: (v) => typeof v === 'function',
  isString: (v) => typeof v === 'string',
  getDefaultStringValue: (value) => {
    switch (value) {
      case '$required':
        return { op: '$exists', value: true }
      case '$exists':
        return { op: '$exists', value: true }
      default:
        return { op: '$eq', value }
    }
  },

  getTypeOf: (value) =>
    Array.isArray(value)
      ? 'array'
      : rulesMatcherUtils.isNumber(value)
        ? 'number'
        : value === null
          ? null
          : typeof value,

  getDefaultRule: (value) => {
    const valueType = rulesMatcherUtils.getTypeOf(value)
    switch (valueType) {
      case 'number':
        return { op: '$eq', value }

      case 'string':
        return rulesMatcherUtils.getDefaultStringValue(value)

      case 'boolean':
        return { op: '$exists', value }

      case 'array':
        return { op: '$in', value }

      case 'object':
        return {
          ...value,
          op: value.op || Object.keys(value)[0],
          value: value.value || value[Object.keys(value)[0]]
        }

      default:
        return { op: '$eq', value }
    }
  },

  isEmpty: (value) => {
    // Null and undefined are empty
    if (!rulesMatcherUtils.isDefined(value)) {
      return true
    }

    // functions are non empty
    if (rulesMatcherUtils.isFunction(value)) {
      return false
    }

    /*   if (isBool(value)) {
        return false;
      }
     */
    // Whitespace only strings are empty
    if (rulesMatcherUtils.isString(value)) {
      return EMPTY_STRING_REGEXP.test(value)
    }

    // For arrays we use the length property
    if (Array.isArray(value)) {
      return value.length === 0
    }

    // Dates have no attributes but aren't empty
    if (rulesMatcherUtils.isDate(value)) {
      return false
    }

    // If we find at least one property we consider it non empty
    let attr
    if (rulesMatcherUtils.isObject(value)) {
      for (attr in value) {
        return false
      }
      return true
    }

    return false
  },

  forceArray: (a) => (Array.isArray(a) ? a : [a]),

  getPath: (path, prefix) => {
    // Avoid crash if someone leaves a empty object as rules in validation
    if (!path) return ''
    if (path.indexOf('^') === 0) {
      return _trimStart(path, '^')
    }

    // da verificare se è ancora utilizzato
    if (path.indexOf('$') === 0) {
      return path
    }

    return prefix ? `${prefix}.${path}` : path
  },
  // TODO BUG NUMERI CON LETTERE 1asdas o solo

  forceNumber: (el) => {
    if (Array.isArray(el)) {
      return el.length
    }

    if (rulesMatcherUtils.isNumber(String(el))) {
      return parseFloat(String(el))
    }

    // fix perchè un valore false < 1 è true, quindi sbagliato, mentre un valore undefined < 1 è false
    return 0
  },

  checkRule: (block, data, options) => {
    if (
      !Array.isArray(block) &&
      block &&
      Object.prototype.hasOwnProperty.call(block, '$and')
    ) {
      if (block && block['$and'] && !block['$and'].length) return true
      return block['$and'].every((item: any) =>
        rulesMatcherUtils.checkRule(item, data, options)
      )
    }

    if (
      !Array.isArray(block) &&
      block &&
      Object.prototype.hasOwnProperty.call(block, '$or')
    ) {
      if (block && block['$or'] && !block['$or'].length) return true
      return block['$or'].some((item: any) =>
        rulesMatcherUtils.checkRule(item, data, options)
      )
    }

    const res = rulesMatcherUtils.rule(block, data, options)
    return res.valid
  },

  getKeys: (rules, options) => {
    if (!rules) return null
    if (typeof rules == 'function') return []

    if (
      !rulesMatcherUtils
        .forceArray(rules)
        .every((r) => rulesMatcherUtils.isObject(r))
    )
      return null

    const keys = {}
    const conditions = Array.isArray(rules) ? { $and: rules } : rules
    rulesMatcherUtils.getKey(conditions, keys, options ?? {})
    return Object.keys(keys)
  }
}

/**
 * Defines a set of comparison operators used for matching rules against user input.
 */
const operators: Operators = {
  $exists: (a, b) => !rulesMatcherUtils.isEmpty(a) === b,

  $eq: (a, b) => a === b,

  $ne: (a, b) => a !== b,

  $gt: (a, b) => rulesMatcherUtils.forceNumber(a) > parseFloat(b),

  $gte: (a, b) => rulesMatcherUtils.forceNumber(a) >= parseFloat(b),

  $lt: (a, b) => rulesMatcherUtils.forceNumber(a) < parseFloat(b),

  $lte: (a, b) => rulesMatcherUtils.forceNumber(a) <= parseFloat(b),

  $strGt: (a, b) => String(a || '').length > parseFloat(b),

  $strGte: (a, b) => String(a || '').length >= parseFloat(b),

  $strLt: (a, b) => String(a || '').length < parseFloat(b),

  $strLte: (a, b) => String(a || '').length <= parseFloat(b),

  $in: (a, b) =>
    rulesMatcherUtils
      .forceArray(b)
      .some(
        (c) =>
          _intersection(
            rulesMatcherUtils.forceArray(a),
            rulesMatcherUtils.forceArray(c)
          ).length
      ),

  $nin: (a, b) =>
    !rulesMatcherUtils
      .forceArray(b)
      .some(
        (c) =>
          _intersection(
            rulesMatcherUtils.forceArray(a),
            rulesMatcherUtils.forceArray(c)
          ).length
      ),

  $all: (a, b) =>
    rulesMatcherUtils
      .forceArray(b)
      .every(
        (c) =>
          _intersection(
            rulesMatcherUtils.forceArray(a),
            rulesMatcherUtils.forceArray(c)
          ).length
      ),

  $regex: (a, b, opt) =>
    rulesMatcherUtils
      .forceArray(b)
      .some((c) =>
        c instanceof RegExp ? c.test(a) : new RegExp(c, opt).test(a)
      )
}

// export default operators

export default rulesMatcherUtils
