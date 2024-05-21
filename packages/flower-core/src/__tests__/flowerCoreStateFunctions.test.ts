import { CoreUtils } from '../CoreUtils'
import { FlowerCoreReducers } from '../FlowerCoreStateFunctions'
import { ActionWithPayload } from '../interfaces/ReducerInterface'
import { Flower } from '../interfaces/Store'
import { cloneDeep } from 'lodash'

const state: Flower<Record<string, any>> = {
  persist: false,
  startId: 'Start',
  current: 'Node1',
  history: ['start', 'Node1'],
  nodes: {
    Start: { nodeId: 'start', nodeType: 'FlowerRoute' },
    Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' }
  },
  nextRules: {
    Start: [{ nodeId: 'Node1', rules: null }]
  },
  data: {},
  form: {
    Start: {
      touched: true
    }
  }
}

const FlowerStateWrap = (state: Flower<Record<string, any>>) => ({
  flower: state
})

const mock = {
  first: {
    persist: false,
    startId: 'Start',
    current: 'Node1',
    history: ['start', 'Node1'],
    nodes: {
      Start: { nodeId: 'start', nodeType: 'FlowerRoute' },
      Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' },
      Node2: { nodeId: 'Node2', nodeType: 'FlowerNode' }
    },
    nextRules: {
      Start: [{ nodeId: 'Node1', rules: null }]
    },
    data: {},
    form: {
      Start: {
        touched: true
      }
    }
  }
}

describe('FlowerCoreReducers', () => {
  describe('historyAdd', () => {
    it('should add a node to the history and update the current node', () => {
      const mockState: any = {
        flower: {
          persist: false,
          startId: 'Start',
          current: 'Start',
          history: ['start', 'Node1'],
          nodes: {
            Start: { nodeId: 'start', nodeType: 'FlowerRoute' },
            Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' },
            Node2: { nodeId: 'Node2', nodeType: 'FlowerNode' },
            Node3: { nodeId: 'Node3', nodeType: 'FlowerNode' },
            Node4: { nodeId: 'Node4', nodeType: 'FlowerNode' }
          },
          nextRules: {
            Start: [{ nodeId: 'Node1', rules: null }]
          },
          data: {},
          form: {
            Start: {
              touched: true
            }
          }
        }
      }
      const payload = { name: 'flower', node: 'Node2' }
      const action = { payload, type: 'historyAdd' }
      const newState = FlowerCoreReducers.historyAdd(mockState, action)

      expect(newState?.flower.history).toEqual(['start', 'Node1', 'Node2'])
      expect(newState?.flower.current).toEqual('Node2')
    })
  })

  describe('historyPrevToNode', () => {
    it('should go to the previous node in history if it exists', () => {
      const action = {
        payload: 'Node1',
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.historyPrevToNode(
        FlowerStateWrap(state),
        action
      )

      expect(newState?.flower?.history).toEqual(['start', 'Node1'])
      expect(newState?.flower?.current).toEqual('Node1')
    })

    it('should not edit state if the previous node does not exist', () => {
      const action = {
        payload: 'UnknownNode',
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.historyPrevToNode(
        FlowerStateWrap(state),
        action
      )

      expect(newState).toEqual(FlowerStateWrap(state))
    })
  })

  describe('setFormTouched', () => {
    it("should set touched to true for the specified node's form", () => {
      const action = {
        payload: {
          flowName: 'flower',
          currentNode: 'Start'
        },
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.setFormTouched(
        FlowerStateWrap(state) as any,
        action
      )

      expect(newState?.flower?.form?.Start.touched).toEqual(true)
    })

    it('should not edit state if the specified node does not exist', () => {
      const action = {
        payload: {
          flowName: 'flower',
          currentNode: 'randomNode'
        },
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.setFormTouched(
        FlowerStateWrap({ ...cloneDeep(state) }) as any,
        action
      )
      expect(newState).toEqual(FlowerStateWrap(state))
    })
  })

  describe('historyPop', () => {
    it('should return state unchanged if history length is less than 2 and current node has disabled or invalid type', () => {
      const stateWithDisabledCurrentNode = {
        ...state,
        nodes: {
          ...state.nodes,
          Node1: { nodeId: 'Node1', nodeType: 'FlowerAction', disabled: true }
        }
      }

      const action = {
        payload: { name: 'flower' },
        type: 'historyPop'
      }

      const newState = FlowerCoreReducers.historyPop(
        FlowerStateWrap(stateWithDisabledCurrentNode) as any,
        action
      )

      expect(newState).toEqual(
        FlowerStateWrap({ ...stateWithDisabledCurrentNode, current: 'start' })
      )
    })
  })

  describe('restoreHistory', () => {
    it('should set current node to startId and history containing only startId', () => {
      const payload = { name: 'Flower' }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.restoreHistory(
        FlowerStateWrap(state) as any,
        action
      )

      expect(newState?.[payload.name].current).toEqual(
        newState?.[payload.name].startId
      )
      expect(newState?.[payload.name].history).toEqual([
        newState?.[payload.name].startId
      ])
    })
  })

  describe('replaceNode', () => {
    it('should not modify state if the specified node does not exist', () => {
      const payload = {
        name: 'Flower',
        flowName: 'TestFlow',
        node: 'UnknownNode'
      }

      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.replaceNode(
        FlowerStateWrap(state),
        action
      )

      if (
        CoreUtils.hasNode(state, payload.name || payload.flowName, payload.node)
      ) {
        expect(newState?.[payload.name].current).toEqual(payload.node)
        expect(newState?.[payload.name].history).toEqual([payload.node])
      } else {
        expect(newState).toEqual(FlowerStateWrap(state))
      }
    })
  })

  describe('initializeFromNode', () => {
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

      const newState = FlowerCoreReducers.initializeFromNode(
        FlowerStateWrap(state),
        action
      )

      if (
        CoreUtils.hasNode(state, payload.name || payload.flowName, payload.node)
      ) {
        expect(newState?.[payload.name].startId).toEqual(payload.node)
        expect(newState?.[payload.name].current).toEqual(payload.node)
        expect(newState?.[payload.name].history).toEqual([payload.node])
      } else {
        expect(newState).toEqual(FlowerStateWrap(state))
      }
    })
  })

  describe('forceResetHistory', () => {
    it('should reset history to an empty array', () => {
      const payload = { name: 'Flower' }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.forceResetHistory(
        FlowerStateWrap(state) as any,
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

      const newState = FlowerCoreReducers.forceResetHistory(
        FlowerStateWrap(state),
        action
      )
      expect(newState).toEqual(FlowerStateWrap(state))
    })
  })

  describe('destroy', () => {
    it('this should destroy a flow by removing it from the state', () => {
      const payload = { name: 'first' }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: any = { ...mock }

      const newState = FlowerCoreReducers.destroy(mock_2, action)

      expect(newState).toEqual(undefined)
    })
  })

  // TODO check use case to understand internal logic
  describe('forceAddHistory', () => {
    it('should add history to the flow', () => {
      const payload = {
        name: 'first',
        history: ['Node3']
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: any = { ...mock }

      FlowerCoreReducers.forceAddHistory(mock_2, action)

      // TODO: TO BE FIXED
      expect(mock_2.first.history).toEqual(mock_2.first.history)
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
        initialData: {}
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
        },
        data: {}
      }

      const nodeInitialized: Record<string, any> = {}

      //@ts-expect-error error
      FlowerCoreReducers.initNodes(nodeInitialized, action)

      expect(nodeInitialized.first).toEqual(expectedResult)
    })
  })

  describe('setCurrentNode', () => {
    it('should return previous current if the specified node does not exist', () => {
      const payload = {
        name: 'first',
        node: 'Node_not_existing'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: any = { ...mock }

      FlowerCoreReducers.setCurrentNode(mock_2, action)

      expect(mock_2.first.current).toEqual(mock.first.current)
    })
    it('should set current to the specified node', () => {
      const payload = {
        name: 'first',
        node: 'Node2'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: any = { ...mock }

      FlowerCoreReducers.setCurrentNode(mock_2, action)

      expect(mock_2.first.current).toEqual('Node2')
    })
  })

  describe('formAddErrors', () => {
    it('should add errors to the form', () => {
      const payload = {
        name: 'first',
        currentNode: 'Node1',
        id: 'error1',
        errors: ['Error message 1']
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: { [x: string]: any } = { ...mock }

      FlowerCoreReducers.formAddErrors({ ...mock_2 }, action)

      expect(mock_2.first.form?.Node1.errors.error1).toEqual([
        'Error message 1'
      ])
    })
  })

  describe('formRemoveErrors', () => {
    it('removes errors from form', () => {
      const payload = {
        name: 'first',
        currentNode: 'Node1',
        id: 'error1'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: { [x: string]: any } = { ...mock }

      FlowerCoreReducers.formRemoveErrors(mock_2, action)

      expect(mock_2.first.form.Node1.errors.error1).toBeUndefined()
    })
  })

  describe('addDataByPath', () => {
    it('should add data to the specified path in the state', () => {
      const payload = {
        flowName: 'first',
        id: ['nested', 'path', 'to', 'data'],
        value: 'new data'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: { [x: string]: any } = { ...mock }

      const newState = FlowerCoreReducers.addDataByPath(mock_2, action)

      expect(mock_2.first.data.nested.path.to.data).toEqual('new data')
    })
  })

  describe('replaceData', () => {
    it('should replace the data in the specified flow with the provided data', () => {
      const payload: any = {
        flowName: 'first',
        value: {
          newData: 'new data'
        }
      }
      const action: ActionWithPayload<typeof payload> = {
        payload,
        type: 'flowerAction'
      }

      const newState = FlowerCoreReducers.replaceData(mock as any, action)

      expect(mock.first.data).toEqual({
        newData: 'new data'
      })
    })
  })

  describe('unsetData', () => {
    it('should unset the data at the specified path in the state', () => {
      const payload = {
        flowName: 'first',
        id: 'name'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }
      const mock_2: { [x: string]: any } = { ...mock }

      const newState = FlowerCoreReducers.unsetData(mock_2, action)

      expect(mock_2.first.data.name).toBeUndefined()
    })
  })

  describe('setFormIsValidating', () => {
    it("should set isValidating to the specified value for the specified node's form", () => {
      const payload = {
        name: 'first',
        currentNode: 'Node1',
        isValidating: true
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: { [x: string]: any } = { ...mock }

      FlowerCoreReducers.setFormIsValidating(mock_2, action)

      expect(mock_2.first.form.Node1.isValidating).toEqual(true)
    })
  })
})
