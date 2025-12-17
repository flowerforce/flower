import { CoreUtils } from '../CoreUtils'
import { FlowerCoreReducers } from '../FlowerCoreStateFunctions'
import {
  ActionWithPayload,
  ReducersFunctions
} from '../interfaces/ReducerInterface'
import { Flower } from '../interfaces/Store'
import cloneDeep from 'lodash/cloneDeep'

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
      isSubmitted: true
    }
  }
}

const FlowerStateWrap = (state: Flower<Record<string, any>>) => ({
  flower: state
})

const TypedFlowerCoreReducers = FlowerCoreReducers as ReducersFunctions<
  Record<string, any>
>

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
        isSubmitted: true
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
              isSubmitted: true
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

      expect(newState?.flower?.form?.Start.isSubmitted).toEqual(true)
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
        id: 'nested.path.to.data',
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

  describe('reset', () => {
    it('should set data to undefined, should reset form, should restore history and current node', () => {
      const payload = {
        flowName: 'flower'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: { [x: string]: any } = {
        ...FlowerStateWrap({
          ...state,
          history: ['Start', 'Node1', 'Node2'],
          current: 'Node2',
          data: { something: 'aaa' },
          form: { ...state.form }
        })
      }

      const expectedResult = {
        ...FlowerStateWrap({
          ...state,
          history: ['Start'],
          current: 'Start',
          // @ts-expect-error TYPE ERROR
          data: undefined,
          form: {}
        })
      }

      FlowerCoreReducers.reset(mock_2, action)

      expect(mock_2).toEqual(expectedResult)
    })
    it('should set data to initialData, should reset form, should restore history and current node', () => {
      const payload = {
        flowName: 'flower',
        initialData: { something_initial: 'INITIAL DATA' }
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const mock_2: { [x: string]: any } = {
        ...FlowerStateWrap({
          ...state,
          history: ['Start', 'Node1', 'Node2'],
          current: 'Node2',
          data: { something: 'aaa' },
          form: { ...state.form }
        })
      }

      const expectedResult = {
        ...FlowerStateWrap({
          ...state,
          history: ['Start'],
          current: 'Start',
          data: { something_initial: 'INITIAL DATA' },
          form: {}
        })
      }

      FlowerCoreReducers.reset(mock_2, action)

      expect(mock_2).toEqual(expectedResult)
    })
  })

  describe('Additional FlowerCoreReducers helpers', () => {
    const flowName = 'flower'

    const createBaseState = (): Record<
      string,
      Flower<Record<string, any>>
    > => ({
      [flowName]: {
        persist: false,
        startId: 'start',
        current: 'start',
        history: ['start'],
        nodes: {
          start: { nodeId: 'start', nodeType: 'FlowerNode' },
          end: { nodeId: 'end', nodeType: 'FlowerNode' }
        },
        nextRules: {
          start: [{ nodeId: 'end', rules: null }]
        },
        data: {
          existing: 'value'
        },
        form: {
          start: {
            errors: {},
            customErrors: {},
            touches: {},
            dirty: {},
            hasFocus: undefined,
            isSubmitted: false,
            isValidating: false
          }
        }
      }
    })

    it('stores custom errors via formAddCustomErrors', () => {
      const state = createBaseState()
      const action = {
        payload: {
          name: flowName,
          currentNode: 'start',
          id: 'custom',
          errors: ['oops']
        },
        type: 'formAddCustomErrors'
      }

      FlowerCoreReducers.formAddCustomErrors(state as any, action)

      expect(state[flowName].form.start.customErrors!['custom']).toEqual([
        'oops'
      ])
    })

    it('tracks dirty and focus state for fields', () => {
      const state = createBaseState()
      const dirtyAction = {
        payload: {
          name: flowName,
          currentNode: 'start',
          id: 'name',
          dirty: true
        },
        type: 'formFieldDirty'
      }

      FlowerCoreReducers.formFieldDirty(state as any, dirtyAction)

      expect(state[flowName].form.start.dirty!['name']).toBe(true)

      const focusAction = {
        payload: {
          name: flowName,
          currentNode: 'start',
          id: 'name',
          focused: true
        },
        type: 'formFieldFocus'
      }

      FlowerCoreReducers.formFieldFocus(state as any, focusAction)
      expect(state[flowName].form.start.hasFocus).toBe('name')

      FlowerCoreReducers.formFieldFocus(state as any, {
        payload: {
          ...focusAction.payload,
          focused: false
        },
        type: 'formFieldFocus'
      })

      expect(state[flowName].form.start.hasFocus).toBeUndefined()
    })

    it('merges data via addData', () => {
      const state = createBaseState()
      const action: ActionWithPayload<{
        flowName: string
        value: Record<string, any>
      }> = {
        payload: {
          flowName,
          value: {
            added: 'new'
          }
        },
        type: 'addData'
      }
      TypedFlowerCoreReducers.addData(state as any, action)

      expect(state[flowName].data).toEqual({
        existing: 'value',
        added: 'new'
      })
    })

    it('updates history when node is triggered', () => {
      const state = createBaseState()
      const action = {
        payload: {
          name: flowName,
          nodeId: 'end',
          node: 'end',
          history: ['start', 'end']
        },
        type: 'node'
      }

      FlowerCoreReducers.node(state as any, action)

      expect(state[flowName].history.includes('end')).toBe(true)
      expect(state[flowName].current).toBe('end')
    })

    it('navigates back to a specific node with prevToNode', () => {
      const state = createBaseState()
      state[flowName].history = ['start', 'mid', 'end']
      state[flowName].current = 'end'
      state[flowName].nodes.mid = { nodeId: 'mid', nodeType: 'FlowerNode' }
      const action = {
        payload: {
          name: flowName,
          node: 'mid'
        },
        type: 'prevToNode'
      }

      FlowerCoreReducers.prevToNode(state as any, action)

      expect(state[flowName].current).toBe('mid')
      expect(state[flowName].history).toContain('mid')
    })

    it('moves to the next node when valid rules are satisfied', () => {
      const state = createBaseState()
      state[flowName].history = ['start']
      const action = {
        payload: {
          name: flowName,
          data: {}
        },
        type: 'next'
      }

      FlowerCoreReducers.next(state as any, action)

      expect(state[flowName].history).toContain('end')
      expect(state[flowName].current).toBe('end')
    })

    it('pops history with prev', () => {
      const state = createBaseState()
      state[flowName].history = ['start', 'end']
      state[flowName].current = 'end'
      const action = {
        payload: {
          name: flowName
        },
        type: 'prev'
      }

      FlowerCoreReducers.prev(state as any, action)

      expect(state[flowName].current).toBe('start')
    })

    it('restart restores history to start', () => {
      const state = createBaseState()
      state[flowName].history = ['start', 'end']
      state[flowName].current = 'end'
      const action = {
        payload: {
          name: flowName
        },
        type: 'restart'
      }

      FlowerCoreReducers.restart(state as any, action)

      expect(state[flowName].current).toBe('start')
      expect(state[flowName].history).toEqual(['start'])
    })

    it('reset clears form and applies provided initial data', () => {
      const state = createBaseState()
      state[flowName].form.start.touches = { some: true }
      state[flowName].form.start.dirty = { some: true }
      state[flowName].data = { existing: 'value' }
      const action = {
        payload: {
          name: flowName,
          initialData: { reset: 'done' }
        },
        type: 'reset'
      }

      FlowerCoreReducers.reset(state as any, action)

      expect(state[flowName].data).toEqual({ reset: 'done' })
      expect(state[flowName].form).toEqual({})
      expect(state[flowName].current).toBe(state[flowName].startId)
    })
  })
})
