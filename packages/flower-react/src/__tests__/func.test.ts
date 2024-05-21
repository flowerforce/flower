import { MatchRules } from '@flowerforce/flower-core'

describe('Test elements utils', () => {
  it('Test RulesMatcher empty args', () => {
    expect(MatchRules.rulesMatcher()).toEqual([true])
  })

  // it('Test RulesMatcher rules string', () => {
  //   try {
  //     expect(MatchRules.rulesMatcher("CIAO")).toEqual([true]);
  //   } catch (e) {
  //     expect(e.message).toBe("Rules accept only array or object");
  //   }
  // });

  it('Test RulesMatcher option undefined', () => {
    expect(MatchRules.rulesMatcher([{ a: 1 }])).toEqual([false])
  })

  it('Test getKeys option undefined', () => {
    expect(MatchRules.utils.getKeys([{ a: 1 }])).toEqual(['a'])
  })
})
