import { MatchRules } from '../RulesMatcher'

const { rulesMatcher } = MatchRules

const testRules = [
  { date: { $exists: true } },
  { val: { $exists: true } },
  { val2: { $exists: false } },
  { func: { $exists: true } },
  { arr: { $exists: true } },
  { name: 'and' },
  { name: '$required' },
  { name: '$exists' },
  { age: 2 },
  { age: { $gt: '1and' } },
  { name: { $strGt: 1 } },
  { arr: { $gte: [1] } },
  { presence: true },
  { arr: ['1'] },
  { lastname: null },
  { lastname: { $strGte: 0 } },
  { lastname: { $strLte: 0 } },
  { lastname: { $strGt: -1 } },
  { lastname: { $strLt: 1 } },
  { xxxx: { $exists: false } },
  { age: { $lte: Infinity } },
  { age: { $lte: 100.5 } },
  { age: { $gte: -100.5 } },
  { ageString: { $gte: -100.5 } },
  {
    $or: [{ name: 'and' }]
  }
]

const testFormValue = {
  name: 'and',
  lastname: null,
  age: 2,
  presence: true,
  date: new Date(),
  val: { a: 1 },
  val2: {},
  func: () => null,
  arr: ['1'],
  ageString: '2.1'
}

describe('rulesMatcher', () => {
  test('returns [true] when no rules are provided', () => {
    const result = rulesMatcher()
    expect(result).toEqual([true])
  })

  test('returns [true] when rule is empty array', () => {
    const emptyRule = { $and: [] }
    const result = rulesMatcher(emptyRule, testFormValue)
    expect(result).toEqual([true])
  })

  // Rules provided and they don't match
  test('returns [false] when rules do not match', () => {
    const rules = [{ age: { $eq: 25 } }]
    const formValue = { age: 30 }
    const result = rulesMatcher(rules, formValue)
    expect(result).toEqual([false])
  })

  test('returns [true] when rules match', () => {
    const rules = { age: { $eq: 25 } }
    const formValue = { age: 25 }
    const result = rulesMatcher(rules, formValue)
    expect(result).toEqual([true])
  })

  test('returns [true] when $and rules and match all', () => {
    const result = rulesMatcher(testRules, testFormValue)
    expect(result).toEqual([true])
  })

  test('returns [false] when $and rules and one not match', () => {
    const result = rulesMatcher(
      [...testRules, { name: 'nomatch' }],
      testFormValue
    )
    expect(result).toEqual([false])
  })

  test('returns [true] when $or rules and one not match', () => {
    const result = rulesMatcher(
      { $or: [...testRules, { name: 'nomatch' }] },
      testFormValue
    )
    expect(result).toEqual([true])
  })
})
