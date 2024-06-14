import { FunctionRule, RulesObject } from './interfaces'
import RulesMatcherUtils from './rules-matcher/utils'
import utils from './rules-matcher/utils'

const rulesMatcher = (
  rules?: Record<string, any> | Record<string, any>[] | FunctionRule,
  formValue: Record<string, any> = {},
  apply = true,
  options?: Record<string, any>
) => {
  if (!rules) return [apply]
  // if (typeof rules !== 'object' && !Array.isArray(rules)) {
  //   throw new Error('Rules accept only array or object');
  // }

  if (typeof rules === 'function') {
    return [rules(formValue) === apply]
  }

  const conditions = Array.isArray(rules)
    ? ({ $and: rules } as RulesObject)
    : (rules as RulesObject)

  const valid = RulesMatcherUtils.checkRule(
    conditions,
    formValue,
    options ?? {}
  )
  return [valid === apply]
}

export const MatchRules = {
  rulesMatcher,
  utils
}
