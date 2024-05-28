import { FlowerStateUtils } from '../FlowerCoreStateUtils'

describe('FlowerStateUtils', () => {
  describe('getAllData', () => {
    it('returns null if state is null or undefined if state is undefined', () => {
      //@ts-expect-error error
      expect(FlowerStateUtils.getAllData(null)).toEqual(null)
      expect(FlowerStateUtils.getAllData(undefined)).toEqual(undefined)
    })

    it('returns an empty object when state is an empty object', () => {
      expect(FlowerStateUtils.getAllData({})).toEqual({})
    })

    it('returns data from state', () => {
      const state = {
        flower1: { data: 'data1' },
        flower2: { data: 'data2' }
      }
      expect(FlowerStateUtils.getAllData(state)).toEqual({
        flower1: 'data1',
        flower2: 'data2'
      })
    })
  })

  describe('selectFlowerFormNode', () => {
    it('returns the form node if found in state', () => {
      const state = {
        name: {
          form: {
            id: 'form-data'
          }
        }
      }
      const result = FlowerStateUtils.selectFlowerFormNode('name', 'id')(state)
      expect(result).toEqual('form-data')
    })
  })

  describe('makeSelectCurrentNextRules', () => {
    it('returns undefined if not found in state', () => {
      const state = {}
      const result = FlowerStateUtils.makeSelectCurrentNextRules('name')(state)
      expect(result).toBeUndefined()
    })
  })

  it('returns undefined if state has no currentNode', () => {
    const state = {
      name: {
        nextRules: {
          currentNodeId: ''
        }
      }
    }
    const result = FlowerStateUtils.makeSelectCurrentNextRules('name')(state)
    expect(result).toBeUndefined()
  })

  describe('makeSelectCurrentNodeId', () => {
    it('returns undefined if state is null or undefined', () => {
      expect(
        //@ts-expect-error error
        FlowerStateUtils.makeSelectCurrentNodeId('name')(null)
      ).toBeUndefined()
      expect(
        //@ts-expect-error error
        FlowerStateUtils.makeSelectCurrentNodeId('name')(undefined)
      ).toBeUndefined()
    })

    it('returns undefined if flowerName is not found in state', () => {
      const state = {}
      expect(
        FlowerStateUtils.makeSelectCurrentNodeId('nonExistent')(state)
      ).toBeUndefined()
    })

    it('returns undefined if currentNodeId is not found in nextRules', () => {
      const state = {
        name: {
          nextRules: {}
        }
      }
      expect(
        FlowerStateUtils.makeSelectCurrentNodeId('name')(state)
      ).toBeUndefined()
    })
  })

  describe('makeSelectNodeErrors', () => {
    it('returns default values if the specified node is not found in state', () => {
      const state = {}
      const result = FlowerStateUtils.makeSelectNodeErrors(
        'nonExistent',
        'currentNodeId'
      )(state)
      expect(result).toEqual({
        touched: false,
        errors: undefined,
        isValidating: undefined,
        isValid: true
      })
    })
  })
})
