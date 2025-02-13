import { CoreUtils } from '../utils/FlowerCoreUtils'
import { FlowerCoreDataReducers } from '../core/state-functions/FlowerFormStateFunctions'
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
        formName: 'form',
        id: 'name',
        errors: ['is equal']
      }
      const action1 = {
        payload: payload1,
        type: 'flowerAction'
      }
      const payload2 = {
        formName: 'form',
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

      FlowerCoreDataReducers.formAddErrors(state, action1)
      FlowerCoreDataReducers.formAddErrors(state, action2)

      expect(state).toEqual(expectedResult)
    })
  })
  describe('formRemoveErrors', () => {
    it('removes errors from form', () => {
      const payload = {
        formName: 'form',
        id: 'name'
      }
      const action = {
        payload,
        type: 'flowerAction'
      }
      FlowerCoreDataReducers.formRemoveErrors(state, action)
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
  // TODO we use thiw at the moment?
  // describe('setFormTouched', () => {
  //   it("should set touched to true for the specified node's form", () => {
  //     const action = {
  //       payload: {
  //         formName: 'form'
  //       },
  //       type: 'flowerAction'
  //     }
  //     console.log('🚀 ~ it ~ newState:', state)

  //     const newState = FlowerCoreDataReducers.setFormTouched(state, action)
  //     console.log('🚀 ~ it ~ newState:', newState)
  //     expect(newState?.flower?.form?.Start.isSubmitted).toEqual(true)
  //   })
  //   it('should not edit state if the specified node does not exist', () => {
  //     const action = {
  //       payload: {
  //         formName: 'flower',
  //         currentNode: 'randomNode'
  //       },
  //       type: 'flowerAction'
  //     }
  //     const newState = FlowerCoreDataReducers.setFormTouched(
  //       FlowerStateWrap({ ...cloneDeep(state) }) as any,
  //       action
  //     )
  //     expect(newState).toEqual(FlowerStateWrap(state))
  //   })
  // })

  describe('addDataByPath', () => {
    it('should add data to the specified path in the state', () => {
      const payload = {
        formName: 'form',
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
        formName: 'form',
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
        formName: 'form',
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
        formName: 'form',
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
      FlowerCoreDataReducers.setFormIsValidating(state, action)
      expect(state).toEqual(expectedResult)
    })
  })
  describe('resetForm', () => {
    it('should reset form', () => {
      const payload = {
        formName: 'form',
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
      FlowerCoreDataReducers.resetForm(state, action)
      expect(state).toEqual(expectedResult)
    })
  })
})
