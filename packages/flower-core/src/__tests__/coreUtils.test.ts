import {
  CoreUtils,
  flattenRules
  // searchEmptyKeyRecursively,
} from '../CoreUtils'

describe('flattenRules function', () => {
  test('should flatten nested object into a single-level object', () => {
    const nestedObject = {
      name: 'Test',
      age: 30,
      address: {
        street: 'Viale Trieste',
        city: 'Cagliari',
        zip: '09128'
      },
      hobbies: ['coding', 'football'],
      preferences: {
        color: 'red',
        food: 'pasta'
      },
      test: {
        test: null
      }
    }

    const flattenedObject = flattenRules(nestedObject)

    expect(flattenedObject).toEqual({
      name: 'Test',
      age: 30,
      'address*street': 'Viale Trieste',
      'address*city': 'Cagliari',
      'address*zip': '09128',
      hobbies: ['coding', 'football'],
      'preferences*color': 'red',
      'preferences*food': 'pasta',
      'test*test': null
    })
  })
})

// describe("searchEmptyKeyRecursively function", () => {
//   test("should return true if any key in the object hierarchy is empty", () => {
//     const obj = {
//       $and: [],
//       filters: {
//         category: "",
//         price: {
//           min: 0,
//           max: 0,
//         },
//         location: {
//           city: "",
//           country: "",
//         },
//       },
//     };

//     expect(searchEmptyKeyRecursively("$and", obj)).toBe(true);
//   });
// });

// describe("searchEmptyKeyRecursively function empty object", () => {
//   test("should return true if any key in the object hierarchy is empty", () => {
//     const obj = {}

//     expect(searchEmptyKeyRecursively("$and", obj)).toBe(true);
//   });
// });

describe('CoreUtils object', () => {
  test('generateRulesName should generate object with names as keys and nodeIds as values', () => {
    const nextRules = [
      { rules: 'Rule1', nodeId: 'Node1' },
      { rules: { name: 'Rule2' }, nodeId: 'Node2' },
      { rules: { other: 'Rule3' }, nodeId: 'Node3' }
    ]

    //@ts-expect-error error
    const result = CoreUtils.generateRulesName(nextRules)

    expect(result).toEqual({
      Rule1: 'Node1',
      Rule2: 'Node2',
      __ERROR_NAME__: 'Node3'
    })
  })

  test('generateRulesName should return an empty object if no rules are provided', () => {
    const nextRules: Array<any> = []

    const result = CoreUtils.generateRulesName(nextRules)

    expect(result).toEqual({})
  })

  test('generateRulesName should handle empty rules', () => {
    const nextRulesEmptyString = [{ rules: '', nodeId: 'Node1' }]
    const nextRulesEmptyObject = [
      {
        rules: {
          rules: null
        },
        nodeId: 'Node2'
      }
    ]

    const resultEmptyString = CoreUtils.generateRulesName(nextRulesEmptyString)
    const resultEmptyObject = CoreUtils.generateRulesName(nextRulesEmptyObject)

    expect(resultEmptyString).toEqual({
      __ERROR_NAME__: 'Node1'
    })

    expect(resultEmptyObject).toEqual({
      __ERROR_NAME__: 'Node2'
    })
  })

  test('generateRulesName should handle missing nodeId', () => {
    const nextRules = [
      { rules: 'Rule1' },
      { rules: { name: 'Rule2' } },
      { rules: { other: 'Rule3' }, nodeId: 'Node3' }
    ]
    //@ts-expect-error error
    const result = CoreUtils.generateRulesName(nextRules)

    expect(result).toEqual({
      Rule1: undefined,
      Rule2: undefined,
      __ERROR_NAME__: 'Node3'
    })
  })

  test('generateRulesName should handle duplicate rule names', () => {
    const nextRules = [
      { rules: 'Rule1', nodeId: 'Node1' },
      { rules: { name: 'Rule1' }, nodeId: 'Node2' }
    ]
    //@ts-expect-error error
    const result = CoreUtils.generateRulesName(nextRules)

    expect(result).toEqual({
      Rule1: 'Node2'
    })
  })

  test('generateNodes', () => {
    const nodes = [
      {
        nodeId: 'step1',
        nodeType: 'FlowerNode',
        nextRules: {
          nodeId: 'step2',
          rules: null
        }
      },
      {
        nodeId: 'step2',
        nodeType: 'FlowerNode',
        nextRules: {
          nodeId: 'step3',
          rules: null
        }
      },
      {
        nodeId: 'step3',
        nodeType: 'FlowerNode',
        nextRules: {
          nodeId: 'step4',
          rules: null
        }
      },
      {
        nodeId: 'step4',
        nodeType: 'FlowerNode'
      }
    ]

    //@ts-expect-error error
    const result = CoreUtils.generateNodes(nodes)

    expect(result).toEqual({
      step1: {
        nodeId: 'step1',
        nodeType: 'FlowerNode'
      },
      step2: {
        nodeId: 'step2',
        nodeType: 'FlowerNode'
      },
      step3: {
        nodeId: 'step3',
        nodeType: 'FlowerNode'
      },
      step4: {
        nodeId: 'step4',
        nodeType: 'FlowerNode'
      }
    })
  })

  test('makeObjectRules', () => {
    const nodes = [
      {
        nodeId: 'step1',
        nodeType: 'FlowerNode',
        nextRules: {
          nodeId: 'step2',
          rules: null
        }
      },
      {
        nodeId: 'step2',
        nodeType: 'FlowerNode',
        nextRules: {
          nodeId: 'step3',
          rules: null
        }
      },
      {
        nodeId: 'step3',
        nodeType: 'FlowerNode',
        nextRules: {
          nodeId: 'step4',
          rules: null
        }
      },
      {
        nodeId: 'step4',
        nodeType: 'FlowerNode'
      }
    ]

    //@ts-expect-error error
    const result = CoreUtils.makeObjectRules(nodes)

    expect(result).toEqual({
      step1: {
        nodeId: 'step2',
        rules: null
      },
      step2: {
        nodeId: 'step3',
        rules: null
      },
      step3: {
        nodeId: 'step4',
        rules: null
      },
      step4: undefined
    })
  })
  test('hasNode [false] no match', () => {
    const state = {
      example4: {
        persist: false,
        startId: 'step1',
        current: 'step4',
        history: ['step1', 'step2', 'step4'],
        nodes: {
          step1: {
            nodeId: 'step1',
            nodeType: 'FlowerNode'
          },
          step2: {
            nodeId: 'step2',
            nodeType: 'FlowerNode'
          },
          step3: {
            nodeId: 'step3',
            nodeType: 'FlowerNode'
          },
          step4: {
            nodeId: 'step4',
            nodeType: 'FlowerNode'
          }
        },
        nextRules: {
          step1: [
            {
              nodeId: 'step2',
              rules: null
            }
          ],
          step2: [
            {
              nodeId: 'step4',
              rules: {
                rules: {
                  $and: [
                    {
                      skipStep3: {
                        $eq: true
                      }
                    }
                  ]
                }
              }
            },
            {
              nodeId: 'step3',
              rules: null
            }
          ],
          step3: [
            {
              nodeId: 'step4',
              rules: null
            }
          ]
        },
        data: {
          skipStep3: true
        },
        form: {
          step1: {
            isSubmitted: true
          },
          step2: {
            isSubmitted: true
          }
        }
      }
    }

    const flowName = 'example4'
    const node = 'nomatch'

    const result = CoreUtils.hasNode(state, flowName, node)

    expect(result).toEqual(false)
  })

  test('hasNode [true]', () => {
    const state = {
      example4: {
        persist: false,
        startId: 'step1',
        current: 'step4',
        history: ['step1', 'step2', 'step4'],
        nodes: {
          step1: {
            nodeId: 'step1',
            nodeType: 'FlowerNode'
          },
          step2: {
            nodeId: 'step2',
            nodeType: 'FlowerNode'
          },
          step3: {
            nodeId: 'step3',
            nodeType: 'FlowerNode'
          },
          step4: {
            nodeId: 'step4',
            nodeType: 'FlowerNode'
          }
        },
        nextRules: {
          step1: [
            {
              nodeId: 'step2',
              rules: null
            }
          ],
          step2: [
            {
              nodeId: 'step4',
              rules: {
                rules: {
                  $and: [
                    {
                      skipStep3: {
                        $eq: true
                      }
                    }
                  ]
                }
              }
            },
            {
              nodeId: 'step3',
              rules: null
            }
          ],
          step3: [
            {
              nodeId: 'step4',
              rules: null
            }
          ]
        },
        data: {
          skipStep3: true
        },
        form: {
          step1: {
            isSubmitted: true
          },
          step2: {
            isSubmitted: true
          }
        }
      }
    }

    const flowName = 'example4'
    const node = 'step4'

    const result = CoreUtils.hasNode(state, flowName, node)

    expect(result).toEqual(true)
  })

  test('mapEdge', () => {
    const nextRules = [
      {
        nodeId: 'step0',
        rules: 'string'
      },
      {
        nodeId: 'step4',
        rules: {
          rules: {
            $and: [
              {
                skipStep3: {
                  $eq: true
                }
              }
            ]
          }
        }
      },
      {
        nodeId: 'step5',
        rules: {
          rules: {
            $and: null
          }
        }
      },
      {
        nodeId: 'step1',
        rules: {}
      },
      {
        nodeId: 'step2',
        rules: {
          rules: 'string'
        }
      },
      {
        nodeId: 'step3',
        rules: null
      }
    ]

    const result = CoreUtils.mapEdge(nextRules)
    expect(result).toEqual([
      {
        nodeId: 'step4',
        rules: {
          rules: {
            $and: [
              {
                skipStep3: {
                  $eq: true
                }
              }
            ]
          }
        }
      },

      {
        nodeId: 'step2',
        rules: {
          rules: 'string'
        }
      },
      {
        nodeId: 'step0',
        rules: 'string'
      },
      {
        nodeId: 'step5',
        rules: {
          rules: {
            $and: null
          }
        }
      },
      {
        nodeId: 'step1',
        rules: {}
      },
      {
        nodeId: 'step3',
        rules: null
      }
    ])
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
    ]

    //@ts-expect-error error
    const result = CoreUtils.generateNodesForFlowerJson(nodes)

    const equalTo = [
      {
        children: [],
        disabled: true,
        nextRules: [
          { nodeId: 'step2', rules: { rules: { enableStep2: { $eq: true } } } }
        ],
        nodeId: 'step1',
        nodeTitle: 'Title',
        nodeType: 'FlowerNode',
        retain: true
      }
    ]

    expect(result).toEqual(equalTo)
  })

  test('getPath id', () => {
    const simplePath = CoreUtils.getPath('path1.path2.path3.path4')
    expect(simplePath).toEqual({ path: ['path1', 'path2', 'path3', 'path4'] })

    const absPath = CoreUtils.getPath('^path1.path2.path3.path4')
    expect(absPath).toEqual({
      flowNameFromPath: 'path1',
      path: ['path2', 'path3', 'path4']
    })

    const rootPath = CoreUtils.getPath('*')
    expect(rootPath).toEqual({ path: '*' })

    const emptyPath = CoreUtils.getPath()
    expect(emptyPath).toEqual({ path: [] })
  })

  test('allEqual match', () => {
    const result = CoreUtils.allEqual([], [])
    const result2 = CoreUtils.allEqual(['test', 'test2'], ['test', 'test2'])
    const result3 = CoreUtils.allEqual(['test'], [])
    expect(result).toEqual(true)
    expect(result2).toEqual(true)
    expect(result3).toEqual(false)
  })

  test('findValidRule if rules match', () => {
    const edgeRuleStep4 = {
      nodeId: 'step4',
      rules: {
        rules: {
          $and: [
            {
              skipStep3: {
                $eq: true
              }
            }
          ]
        }
      }
    }

    const nextRules = [
      {
        nodeId: 'step1',
        rules: 'string'
      },
      {
        nodeId: 'step1',
        rules: {}
      },
      {
        nodeId: 'step2',
        rules: {
          rules: 'string'
        }
      },
      edgeRuleStep4,
      {
        nodeId: 'step3',
        rules: null
      }
    ]

    const data = {
      skipStep3: true
    }

    //@ts-expect-error error
    const result = CoreUtils.findValidRule(nextRules, data)
    expect(result).toEqual(edgeRuleStep4)
  })

  test('findValidRule if rules not match', () => {
    const edgeRuleStep4 = {
      nodeId: 'step4',
      rules: {
        rules: {
          $and: [
            {
              skipStep3: {
                $eq: true
              }
            }
          ]
        }
      }
    }

    const edgeRuleStep3 = {
      nodeId: 'step3',
      rules: null
    }

    const nextRules = [edgeRuleStep4, edgeRuleStep3]

    const data = {}

    //@ts-expect-error error
    const result = CoreUtils.findValidRule(nextRules, data)
    expect(result).toEqual(edgeRuleStep3)
  })
})
