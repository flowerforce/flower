import { get as _get } from 'lodash';
import RulesMatcherUtils from './rules-matcher/utils';
import operators from './rules-matcher/operators';
import utils from './rules-matcher/utils';
import { RulesObject } from './interfaces/Store';

const rulesMatcher = (
  rules?: Record<string, any> | Record<string, any>[],
  formValue: Record<string, any> = {},
  apply: boolean = true,
  options?: Record<string, any>
) => {
  if (!rules) return [apply];
  // if (typeof rules !== 'object' && !Array.isArray(rules)) {
  //   throw new Error('Rules accept only array or object');
  // }

  const conditions = Array.isArray(rules)
    ? ({ $and: rules } as RulesObject<any>)
    : (rules as RulesObject<any>);
  const valid = RulesMatcherUtils.checkRule(
    conditions,
    formValue,
    options ?? {}
  );
  return [valid === apply];
};

export const MatchRules = {
  rulesMatcher,
  operators,
  utils,
};
