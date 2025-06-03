import { CoreUtils } from '../utils/FlowerCoreUtils'
import { FlowerCoreBaseReducers } from '../state-manager/state-functions/FlowerCoreStateFunctions'
import { Flower } from '../interfaces/Store'
import { REDUCER_NAME } from '../constants'
import { FlowerCoreStateBaseSelectors } from '../state-manager/state-selectors/FlowerCoreStateSelectors'
import cloneDeep from 'lodash/cloneDeep'

type State = Partial<
  Record<REDUCER_NAME, Record<string, Flower<Record<string, any>>>>
>

const initialState: Record<string, Flower<Record<string, any>>> = {
  flower: {
    persist: false,
    startId: 'Start',
    current: 'Node1',
    history: ['start', 'Node1'],
    nodes: {
      Start: { nodeId: 'Start', nodeType: 'FlowerRoute' },
      Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' }
    },
    nextRules: {
      Start: [{ nodeId: 'Node1', rules: null }]
    }
  }
}

const mock: any = {
  flower: {
    persist: false,
    startId: 'Start',
    current: 'Start',
    history: ['Start', 'Node1'],
    nodes: {
      Start: { nodeId: 'Start', nodeType: 'FlowerRoute' },
      Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' },
      Node2: { nodeId: 'Node2', nodeType: 'FlowerNode' },
      Node3: { nodeId: 'Node3', nodeType: 'FlowerNode' },
      Node4: { nodeId: 'Node4', nodeType: 'FlowerNode' }
    },
    nextRules: {
      Start: [{ nodeId: 'Node1', rules: null }]
    }
  }
}

const FlowerStateWrap = (
  state: Record<string, Flower<Record<string, any>>>
): State => ({
  [REDUCER_NAME.FLOWER_FLOW]: state
})

describe('FlowerCoreBaseReducers', () => {
  describe('historyAdd', () => {
    it('should add a node to the history and update the current node', () => {
      const mockState = cloneDeep(mock)
      const payload = { name: 'flower', node: 'Node2' }
      const action = { payload, type: 'historyAdd' }
      const newState = FlowerCoreBaseReducers.historyAdd(mockState, action)
      if (!newState) return

      expect(newState.flower.history).toEqual(['Start', 'Node1', 'Node2'])
      expect(newState.flower.current).toEqual('Node2')
    })
  })
  describe('historyPrevToNode', () => {
    const mockState = cloneDeep(mock)
    it('should go to the previous node in history if it exists', () => {
      const action = {
        payload: { node: 'Node1', name: 'flower' },
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.historyPrevToNode(
        mockState,
        action
      )
      expect(newState?.flower?.history).toEqual(['Start', 'Node1'])
      expect(newState?.flower?.current).toEqual('Node1')
    })

    it('should not edit state if the previous node does not exist', () => {
      const action = {
        payload: 'UnknownNode',
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.historyPrevToNode(
        mockState,
        action
      )

      expect(newState).toEqual(mockState)
    })
  })
  describe('historyPop', () => {
    const mockState = cloneDeep(mock)
    it('should return state unchanged if history length is less than 2 and current node has disabled or invalid type', () => {
      const action = {
        payload: { name: 'flower' },
        type: 'historyPop'
      }

      const newState = FlowerCoreBaseReducers.historyPop(mockState, action)

      expect(newState).toEqual({
        flower: { ...mockState.flower, current: 'Start' }
      })
    })
  })
  describe('restoreHistory', () => {
    const mockState = cloneDeep(mock)
    it('should set current node to startId and history containing only startId', () => {
      const payload = { name: 'flower' }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.restoreHistory(mockState, action)

      expect(newState?.[payload.name].current).toEqual(
        newState?.[payload.name].startId
      )
      expect(newState?.[payload.name].history).toEqual([
        newState?.[payload.name].startId
      ])
    })
  })
  describe('replaceNode', () => {
    const mockState: any = {
      flower: {
        ...cloneDeep(mock.flower),
        nodes: {
          Start: { nodeId: 'start', nodeType: 'FlowerRoute' },
          Node1: { nodeId: 'Node1', nodeType: 'FlowerAction', disabled: true },
          Node2: { nodeId: 'Node2', nodeType: 'FlowerNode' },
          Node3: { nodeId: 'Node3', nodeType: 'FlowerNode' },
          Node4: { nodeId: 'Node4', nodeType: 'FlowerNode' }
        }
      }
    }
    it('should not modify state if the specified node does not exist', () => {
      const payload = {
        name: 'flower',
        flowName: 'TestFlow',
        node: 'UnknownNode'
      }

      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.replaceNode(mockState, action)

      if (
        CoreUtils.hasNode(
          mockState,
          payload.name || payload.flowName,
          payload.node
        )
      ) {
        expect(newState?.[payload.name].current).toEqual(payload.node)
        expect(newState?.[payload.name].history).toEqual([payload.node])
      } else {
        expect(newState).toEqual(mockState)
      }
    })
  })
  describe('initializeFromNode', () => {
    const mockState = cloneDeep(mock)
    it('should initialize state with startId, current node, and history containing only startId if the specified node exists', () => {
      const payload = {
        name: 'Flower',
        flowName: 'TestFlow',
        node: 'Node3'
      }

      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.initializeFromNode(
        mockState,
        action
      )

      if (
        CoreUtils.hasNode(
          mockState,
          payload.name || payload.flowName,
          payload.node
        )
      ) {
        expect(newState?.[payload.name].startId).toEqual(payload.node)
        expect(newState?.[payload.name].current).toEqual(payload.node)
        expect(newState?.[payload.name].history).toEqual([payload.node])
      } else {
        expect(newState).toEqual(mockState)
      }
    })
  })
  //   //   describe('setFormTouched', () => {
  //   //     it("should set touched to true for the specified node's form", () => {
  //   //       const action = {
  //   //         payload: {
  //   //           formName: 'flower',
  //   //           currentNode: 'Start'
  //   //         },
  //   //         type: 'flowerAction'
  //   //       }

  //   //       const newState = FlowerCoreBaseReducers.setFormTouched(
  //   //         FlowerStateWrap(state) as any,
  //   //         action
  //   //       )

  //   //       expect(newState?.flower?.form?.Start.isSubmitted).toEqual(true)
  //   //     })

  //   //     it('should not edit state if the specified node does not exist', () => {
  //   //       const action = {
  //   //         payload: {
  //   //           formName: 'flower',
  //   //           currentNode: 'randomNode'
  //   //         },
  //   //         type: 'flowerAction'
  //   //       }

  //   //       const newState = FlowerCoreBaseReducers.setFormTouched(
  //   //         FlowerStateWrap({ ...cloneDeep(state) }) as any,
  //   //         action
  //   //       )
  //   //       expect(newState).toEqual(FlowerStateWrap(state))
  //   //     })
  //   //   })

  describe('forceResetHistory', () => {
    const mockState = cloneDeep(mock)
    it('should reset history to an empty array', () => {
      const payload = { name: 'flower' }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.forceResetHistory(
        mockState,
        action
      )

      expect(newState?.[payload.name].history).toEqual([])
    })

    it('should not edit the state if name or flowName is not provided in payload', () => {
      const payload = {}
      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.forceResetHistory(
        mockState,
        action
      )
      expect(newState).toEqual(mockState)
    })
  })

  describe('destroy', () => {
    const mockState = { ...cloneDeep(mock), first: { ...cloneDeep(mock) } }

    it('this should destroy a flow by removing it from the state', () => {
      const payload = { name: 'first' }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreBaseReducers.destroy(mockState, action)

      expect(newState).toEqual(cloneDeep(mock))
    })
  })

  describe('initNodes', () => {
    it('initializes the state with the provided nodes and data', () => {
      const payload = {
        name: 'first',
        persist: false,
        startId: 'Start',
        current: 'Node1',
        nodes: [
          { nodeId: 'Start', nodeType: 'FlowerRoute' },
          { nodeId: 'Node1', nodeType: 'FlowerNode' },
          { nodeId: 'Node2', nodeType: 'FlowerNode' }
        ],
        initialState: {}
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const expectedResult = {
        persist: false,
        startId: 'Start',
        current: 'Start',
        history: ['Start'],
        nodes: {
          Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' },
          Node2: { nodeId: 'Node2', nodeType: 'FlowerNode' },
          Start: { nodeId: 'Start', nodeType: 'FlowerRoute' }
        },
        nextRules: {
          Node1: undefined,
          Node2: undefined,
          Start: undefined
        }
      }

      const nodeInitialized: Record<string, any> = {}

      //@ts-expect-error error
      FlowerCoreBaseReducers.initNodes(nodeInitialized, action)

      expect(nodeInitialized.first).toEqual(expectedResult)
    })
  })

  describe('setCurrentNode', () => {
    const mockState = cloneDeep(mock)
    it('should return previous current if the specified node does not exist', () => {
      const payload = {
        name: 'flower',
        node: 'Node_not_existing'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      FlowerCoreBaseReducers.setCurrentNode(mockState, action)

      expect(mockState.flower.current).toEqual(mock.flower.current)
    })
    it('should set current to the specified node', () => {
      const payload = {
        name: 'flower',
        node: 'Node2'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      FlowerCoreBaseReducers.setCurrentNode(mockState, action)

      expect(mockState.flower.current).toEqual('Node2')
    })
  })

  //   //   describe('formAddErrors', () => {
  //   //     it('should add errors to the form', () => {
  //   //       const payload = {
  //   //         formName: 'first',
  //   //         currentNode: 'Node1',
  //   //         id: 'error1',
  //   //         errors: ['Error message 1']
  //   //       }
  //   //       const action = {
  //   //         payload,
  //   //         type: 'flowerAction'
  //   //       }

  //   //       const mock_2: { [x: string]: any } = { ...mock }

  //   //       FlowerCoreBaseReducers.formAddErrors({ ...mock_2 }, action)

  //   //       expect(mock_2.first.form?.Node1.errors.error1).toEqual([
  //   //         'Error message 1'
  //   //       ])
  //   //     })
  //   //   })

  //   //   describe('formRemoveErrors', () => {
  //   //     it('removes errors from form', () => {
  //   //       const payload = {
  //   //         formName: 'first',
  //   //         currentNode: 'Node1',
  //   //         id: 'error1'
  //   //       }
  //   //       const action = {
  //   //         payload,
  //   //         type: 'flowerAction'
  //   //       }

  //   //       const mock_2: { [x: string]: any } = { ...mock }

  //   //       FlowerCoreBaseReducers.formRemoveErrors(mock_2, action)

  //   //       expect(mock_2.first.form.Node1.errors.error1).toBeUndefined()
  //   //     })
  //   //   })

  //   //   describe('addDataByPath', () => {
  //   //     it('should add data to the specified path in the state', () => {
  //   //       const payload = {
  //   //         formName: 'first',
  //   //         id: 'nested.path.to.data',
  //   //         value: 'new data'
  //   //       }
  //   //       const action = {
  //   //         payload,
  //   //         type: 'flowerAction'
  //   //       }

  //   //       const mock_2: { [x: string]: any } = { ...mock }

  //   //       const newState = FlowerCoreBaseReducers.addDataByPath(mock_2, action)

  //   //       expect(mock_2.first.data.nested.path.to.data).toEqual('new data')
  //   //     })
  //   //   })

  //   //   describe('replaceData', () => {
  //   //     it('should replace the data in the specified flow with the provided data', () => {
  //   //       const payload: any = {
  //   //         flowName: 'first',
  //   //         value: {
  //   //           newData: 'new data'
  //   //         }
  //   //       }
  //   //       const action: ActionWithPayload<typeof payload> = {
  //   //         payload,
  //   //         type: 'flowerAction'
  //   //       }

  //   //       const newState = FlowerCoreBaseReducers.replaceData(mock as any, action)

  //   //       expect(mock.first.data).toEqual({
  //   //         newData: 'new data'
  //   //       })
  //   //     })
  //   //   })

  //   //   describe('unsetData', () => {
  //   //     it('should unset the data at the specified path in the state', () => {
  //   //       const payload = {
  //   //         formName: 'first',
  //   //         id: 'name'
  //   //       }
  //   //       const action = {
  //   //         payload,
  //   //         type: 'flowerAction'
  //   //       }
  //   //       const mock_2: { [x: string]: any } = { ...mock }

  //   //       const newState = FlowerCoreBaseReducers.unsetData(mock_2, action)

  //   //       expect(mock_2.first.data.name).toBeUndefined()
  //   //     })
  //   //   })

  //   //   describe('setFormIsValidating', () => {
  //   //     it("should set isValidating to the specified value for the specified node's form", () => {
  //   //       const payload = {
  //   //         formName: 'first',
  //   //         currentNode: 'Node1',
  //   //         isValidating: true
  //   //       }
  //   //       const action = {
  //   //         payload,
  //   //         type: 'flowerAction'
  //   //       }

  //   //       const mock_2: { [x: string]: any } = { ...mock }

  //   //       FlowerCoreBaseReducers.setFormIsValidating(mock_2, action)

  //   //       expect(mock_2.first.form.Node1.isValidating).toEqual(true)
  //   //     })
  //   //   })

  describe('reset', () => {
    const mockState = cloneDeep(mock)

    it('should restore history and current node', () => {
      const payload = {
        flowName: 'flower'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const expectedResult = {
        flower: {
          ...mockState.flower,
          history: ['Start'],
          current: 'Start'
        }
      }

      FlowerCoreBaseReducers.reset(mockState, action)

      expect(mockState).toEqual(expectedResult)
    })
  })
})
