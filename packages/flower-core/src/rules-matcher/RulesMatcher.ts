import { FunctionRule, RulesObject } from '../interfaces'
import { rulesMatcherUtils } from './utils'

export const rulesMatcher = (
  rules?: Record<string, any> | Record<string, any>[] | FunctionRule,
  dataValue: Record<string, any> = {},
  apply = true,
  options?: Record<string, any>
) => {
  if (!rules) return [apply]
  // if (typeof rules !== 'object' && !Array.isArray(rules)) {
  //   throw new Error('Rules accept only array or object');
  // }

  if (typeof rules === 'function') {
    return [rules(dataValue) === apply]
  }

  const conditions = Array.isArray(rules)
    ? ({ $and: rules } as RulesObject<any>)
    : (rules as RulesObject<any>)

  const valid = rulesMatcherUtils.checkRule(
    conditions,
    dataValue,
    options ?? {}
  )
  return [valid === apply]
}
