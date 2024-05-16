import { intersection as _intersection } from 'lodash'
import RulesMatcherUtils from './utils'
import { Operators } from './interface'

/**
 * Defines a set of comparison operators used for matching rules against user input.
 */
const operators: Operators = {
  $exists: (a, b) => !RulesMatcherUtils.isEmpty(a) === b,

  $eq: (a, b) => a === b,

  $ne: (a, b) => a !== b,

  $gt: (a, b) => RulesMatcherUtils.forceNumber(a) > parseFloat(b),

  $gte: (a, b) => RulesMatcherUtils.forceNumber(a) >= parseFloat(b),

  $lt: (a, b) => RulesMatcherUtils.forceNumber(a) < parseFloat(b),

  $lte: (a, b) => RulesMatcherUtils.forceNumber(a) <= parseFloat(b),

  $strGt: (a, b) => String(a || '').length > parseFloat(b),

  $strGte: (a, b) => String(a || '').length >= parseFloat(b),

  $strLt: (a, b) => String(a || '').length < parseFloat(b),

  $strLte: (a, b) => String(a || '').length <= parseFloat(b),

  $in: (a, b) =>
    RulesMatcherUtils.forceArray(b).some(
      (c) =>
        _intersection(
          RulesMatcherUtils.forceArray(a),
          RulesMatcherUtils.forceArray(c)
        ).length
    ),

  $nin: (a, b) =>
    !RulesMatcherUtils.forceArray(b).some(
      (c) =>
        _intersection(
          RulesMatcherUtils.forceArray(a),
          RulesMatcherUtils.forceArray(c)
        ).length
    ),

  $all: (a, b) =>
    RulesMatcherUtils.forceArray(b).every(
      (c) =>
        _intersection(
          RulesMatcherUtils.forceArray(a),
          RulesMatcherUtils.forceArray(c)
        ).length
    ),

  $regex: (a, b, opt) =>
    RulesMatcherUtils.forceArray(b).some((c) =>
      c instanceof RegExp ? c.test(a) : new RegExp(c, opt).test(a)
    )
}

export default operators
