import { rulesMatcher, rulesMatcherUtils } from '@flowerforce/flower-core'
import { generateNodesForFlowerJson } from '../utils'

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
  test('generateNodesForFlowerJson', () => {
    const nodes = [
      {
        type: {
          displayName: 'FlowerNode'
        },
        props: {
          id: 'step1',
          as: 'div',
          to: {
            step2: {
              rules: {
                enableStep2: { $eq: true }
              }
            }
          },
          data: {
            children: [],
            title: 'Title'
          },
          retain: true,
          disabled: true
        }
      }
    ] as any

    const result = generateNodesForFlowerJson(nodes)

    const equalTo = [
      {
        children: [],
        disabled: true,
        nextRules: [
          { nodeId: 'step2', rules: { rules: { enableStep2: { $eq: true } } } }
        ],
        nodeId: 'step1',
        nodeTitle: 'Title',
        nodeType: 'div',
        retain: true
      }
    ]

    expect(result).toEqual(equalTo)
  })

  it('Test getKeys option undefined', () => {
    expect(rulesMatcherUtils.getKeys([{ a: 1 }])).toEqual(['a'])
  })
})
