import { rulesMatcher, rulesMatcherUtils } from '@flowerforce/flower-core'

describe('Test elements utils', () => {
  it('Test RulesMatcher empty args', () => {
    expect(rulesMatcher()).toEqual([true])
  })

  // it('Test RulesMatcher rules string', () => {
  //   try {
  //     expect(rulesMatcher("CIAO")).toEqual([true]);
  //   } catch (e) {
  //     expect(e.message).toBe("Rules accept only array or object");
  //   }
  // });

  it('Test RulesMatcher option undefined', () => {
    expect(rulesMatcher([{ a: 1 }])).toEqual([false])
  })

  it('Test getKeys option undefined', () => {
    expect(rulesMatcherUtils.getKeys([{ a: 1 }])).toEqual(['a'])
  })
})
