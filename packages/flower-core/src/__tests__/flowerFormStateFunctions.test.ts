import { CoreUtils } from '../utils/FlowerCoreUtils'
import { FlowerCoreDataReducers } from '../state-manager/state-functions/FlowerDataStateFunctions'
import { Flower } from '../interfaces/Store'
import { REDUCER_NAME } from '../constants'
import cloneDeep from 'lodash/cloneDeep'
import _get from 'lodash/get'

const state: Record<string, any> = {}

const FlowerStateWrap = (
  state: Record<string, Flower<Record<string, any>>>
) => ({
  [REDUCER_NAME.FLOWER_DATA]: state
})

describe('FlowerFormReducers', () => {
  describe('formAddErrors', () => {
    it('should add errors to the form', () => {
      const payload1 = {
        rootName: 'form',
        id: 'name',
        errors: ['is equal']
      }
      const action1 = {
        payload: payload1,
        type: 'flowerAction'
      }
      const payload2 = {
        rootName: 'form',
        id: 'surname',
        errors: ['is equal']
      }
      const action2 = {
        payload: payload2,
        type: 'flowerAction'
      }

      const expectedResult = {
        form: {
          errors: {
            name: ['is equal'],
            surname: ['is equal']
          }
        }
      }

      FlowerCoreDataReducers.addDataErrors(state, action1)
      FlowerCoreDataReducers.addDataErrors(state, action2)

      expect(state).toEqual(expectedResult)
    })
  })
  describe('formRemoveErrors', () => {
    it('removes errors from form', () => {
      const payload = {
        rootName: 'form',
        id: 'name'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }
      FlowerCoreDataReducers.removeDataErrors(state, action)
      const expectedResult = {
        form: {
          errors: {
            surname: ['is equal']
          }
        }
      }
      expect(state).toEqual(expectedResult)
    })
  })

  describe('addDataByPath', () => {
    it('should add data to the specified path in the state', () => {
      const payload = {
        rootName: 'form',
        id: 'nested.path.to.data',
        value: 'new data'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }
      FlowerCoreDataReducers.addDataByPath(state, action)

      expect(
        _get(state, ['form', 'data', 'nested', 'path', 'to', 'data'])
      ).toEqual('new data')
    })
  })
  describe('replaceData', () => {
    it('should replace the data in the specified flow with the provided data', () => {
      const payload: any = {
        rootName: 'form',
        value: {
          name: 'andrea',
          surname: 'rossi'
        }
      }
      const action = {
        payload,
        type: 'flowerAction'
      }

      const expectedResult = {
        form: {
          ...cloneDeep(state.form),
          data: payload.value
        }
      }
      FlowerCoreDataReducers.replaceData(state, action)
      expect(state).toEqual(expectedResult)
    })
  })
  describe('unsetData', () => {
    it('should unset the data at the specified path in the state', () => {
      const payload = {
        rootName: 'form',
        id: ['name']
      }
      const action = {
        payload,
        type: 'flowerAction'
      }
      const expectedResult = {
        form: {
          ...cloneDeep(state.form),
          data: {
            surname: state.form.data.surname
          }
        }
      }
      FlowerCoreDataReducers.unsetData(state, action)
      expect(state).toEqual(expectedResult)
    })
  })
  describe('setFormIsValidating', () => {
    it("should set isValidating to the specified value for the specified node's form", () => {
      const payload = {
        rootName: 'form',
        isValidating: true
      }
      const action = {
        payload,
        type: 'flowerAction'
      }
      const expectedResult = {
        ...cloneDeep(state),
        form: {
          ...cloneDeep(state.form),
          isValidating: true
        }
      }
      FlowerCoreDataReducers.setIsDataValidating(state, action)
      expect(state).toEqual(expectedResult)
    })
  })
  describe('resetForm', () => {
    it('should reset form', () => {
      const payload = {
        rootName: 'form',
        isValidating: true
      }
      const action = {
        payload,
        type: 'flowerAction'
      }
      const expectedResult = {
        ...cloneDeep(state),
        form: {
          ...cloneDeep(state.form),
          data: {}
        }
      }
      FlowerCoreDataReducers.resetData(state, action)
      expect(state).toEqual(expectedResult)
    })
  })
})
