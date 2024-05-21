import { FlowerCoreStateSelectors } from '../FlowerCoreStateSelectors'
import { Flower } from '../interfaces/Store'

//todo: double check if tests are ok

const TEST_FLOW_NAME = 'test_flow'

const state: { flower: { [x: string]: Flower<Record<string, any>> } } = {
  flower: {
    test_flow: {
      persist: false,
      startId: 'Start',
      current: 'Node1',
      history: ['start', 'Node1'],
      nodes: {
        Start: { nodeId: 'start', nodeType: 'FlowerRoute' },
        Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' },
        Node2: { nodeId: 'Node2', nodeType: 'FlowerNode', retain: true }
      },
      nextRules: {
        Start: [{ nodeId: 'Node1', rules: null }]
      },
      data: {
        name: 'UserName',
        test_getDataFromState: { value: 'test' }
      },
      form: {
        Start: {
          touched: true,
          errors: {},
          isValidating: false
        }
      }
    }
  }
}

describe('FlowerCoreSelectors', () => {
  describe('SelectGlobal', () => {
    it('should return the flower object in state.flower', () => {
      const flower = FlowerCoreStateSelectors.selectGlobal(state)
      expect(flower).toEqual(state.flower)
    })
  })

  describe('selectFlower', () => {
    it('should return the flower object for the given name', () => {
      const flower = FlowerCoreStateSelectors.selectFlower(TEST_FLOW_NAME)(
        state.flower
      )
      expect(flower).toEqual(state.flower[TEST_FLOW_NAME])
    })
  })

  describe('selectFlowerFormNode', () => {
    it('should return the form object for the given node id', () => {
      const nodeId = 'start'
      const selectedForm = FlowerCoreStateSelectors.selectFlowerFormNode(
        nodeId
      )(state.flower[TEST_FLOW_NAME])
      expect(selectedForm).toEqual(state.flower[TEST_FLOW_NAME].form[nodeId])
    })
  })

  describe('selectFlowerHistory', () => {
    it('should return the history array from the given flower object', () => {
      const history = FlowerCoreStateSelectors.selectFlowerHistory(
        state.flower[TEST_FLOW_NAME]
      )
      expect(history).toEqual(state.flower[TEST_FLOW_NAME].history)
    })
  })

  describe('makeSelectNodesIds', () => {
    it('should return the nodes object from the given flower object', () => {
      const nodes = FlowerCoreStateSelectors.makeSelectNodesIds(
        state.flower[TEST_FLOW_NAME]
      )
      expect(nodes).toEqual(state.flower[TEST_FLOW_NAME].nodes)
    })
  })

  describe('makeSelectStartNodeId', () => {
    it('should return the startNodeId from the given flower object', () => {
      const startNodeId = FlowerCoreStateSelectors.makeSelectStartNodeId(
        state.flower[TEST_FLOW_NAME]
      )
      expect(startNodeId).toEqual(state.flower[TEST_FLOW_NAME].startId)
    })
  })

  describe('getDataByFlow', () => {
    it('should return the data object in the state.flower.data', () => {
      const data = FlowerCoreStateSelectors.getDataByFlow(
        state.flower[TEST_FLOW_NAME]
      )
      expect(data).toEqual(state.flower[TEST_FLOW_NAME].data)
    })
  })

  describe('getDataFromState', () => {
    it('should return data object if id is "*"', () => {
      const id = '*'

      const result = FlowerCoreStateSelectors.getDataFromState(id)(
        state.flower[TEST_FLOW_NAME].data
      )

      expect(result).toEqual(state.flower[TEST_FLOW_NAME].data)
    })

    it('should return the data at the specified id if id is not "*"', () => {
      const id = ['test_getDataFromState', 'value']

      const result = FlowerCoreStateSelectors.getDataFromState(id)(
        state.flower[TEST_FLOW_NAME].data
      )

      expect(result).toEqual('test')
    })
  })

  describe('makeSelectNodeFormTouched', () => {
    it('should return the touched node', () => {
      const touched = FlowerCoreStateSelectors.makeSelectNodeFormTouched(
        state.flower[TEST_FLOW_NAME].form.Start
      )
      expect(touched).toEqual(state.flower[TEST_FLOW_NAME].form.Start.touched)
    })
  })

  describe('makeSelectCurrentNodeId', () => {
    it('should return the currentNodeId or startNodeId', () => {
      const current = FlowerCoreStateSelectors.makeSelectCurrentNodeId(
        state.flower[TEST_FLOW_NAME],
        state.flower[TEST_FLOW_NAME].startId
      )

      expect(current).toEqual(state.flower[TEST_FLOW_NAME].current || 'start')
    })
  })

  describe('makeSelectCurrentNodeDisabled', () => {
    it('should return true if the current node is disabled', () => {
      const nodes = {
        Start: { disabled: true },
        Node1: { disabled: false }
      }
      const current = 'Start'

      const isDisabled = FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled(
        nodes,
        current
      )

      expect(isDisabled).toBe(true)
    })

    it('should return false if the current node is not disabled', () => {
      const nodes = {
        Start: { disabled: true },
        Node1: { disabled: false }
      }
      const current = 'Node1'

      const isDisabled = FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled(
        nodes,
        current
      )

      expect(isDisabled).toBe(false)
    })

    it('should return false if the current node does not exist in the nodes object', () => {
      const nodes = {
        Start: { disabled: true },
        Node1: { disabled: false }
      }
      const current = 'UnknownNode'

      const isDisabled = FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled(
        nodes,
        current
      )

      expect(isDisabled).toBe(false)
    })
  })

  describe('makeSelectPrevNodeRetain', () => {
    it("should return undefined if no previous node has 'retain' property", () => {
      const prevNode = FlowerCoreStateSelectors.makeSelectPrevNodeRetain(
        state.flower[TEST_FLOW_NAME].nodes,
        state.flower[TEST_FLOW_NAME].history,
        'Node1'
      )
      expect(prevNode).toBeUndefined()
    })

    it("should return undefined if the current node has 'retain' property", () => {
      const prevNode = FlowerCoreStateSelectors.makeSelectPrevNodeRetain(
        state.flower[TEST_FLOW_NAME].nodes,
        state.flower[TEST_FLOW_NAME].history,
        'Node1'
      )
      expect(prevNode).toBeUndefined()
    })

    describe('makeSelectNodeErrors', () => {
      it('should return default values if form is not provided', () => {
        const defaultErrors = {
          touched: false,
          errors: undefined,
          isValidating: undefined,
          isValid: true
        }
        const nodeErrors =
          FlowerCoreStateSelectors.makeSelectNodeErrors(undefined)
        expect(nodeErrors).toEqual(defaultErrors)
      })
    })
  })

  describe('makeSelectFieldError', () => {
    it('should return an empty array if validate is false', () => {
      const name = 'UserName'
      const id = 'start'
      const validate = null

      const selectFieldError = FlowerCoreStateSelectors.makeSelectFieldError(
        name,
        id,
        validate
      )
      const result = selectFieldError({} as Flower<any>)

      expect(result).toEqual([])
    })

    it('should return an empty array if validate array is empty', () => {
      const name = 'UserName'
      const id = 'start'
      const validate: Array<any> = []

      const selectFieldError = FlowerCoreStateSelectors.makeSelectFieldError(
        name,
        id,
        validate
      )
      const result = selectFieldError({} as Flower<any>)

      expect(result).toEqual([])
    })
  })

  describe('selectorRulesDisabled', () => {
    it('should return false if rules or keys are not provided', () => {
      const id = 'id'
      const rules = null
      const keys = null
      const flowName = 'flower'
      const value = { value: 'test' }

      const data: any = {}
      const form: any = {}

      const result = FlowerCoreStateSelectors.selectorRulesDisabled(
        id,
        rules,
        keys,
        flowName,
        value
      )(data, form)
      expect(result).toBe(false)
    })
  })
})
