import { useCallback, useContext } from 'react'
import { CoreUtils } from '@flowerforce/flower-core'
import get from 'lodash/get'
import { context } from '../context/formcontext'
import { makeSelectCurrentNodeId, makeSelectNodeErrors } from '../selectors'
import { actions } from '../reducer/formReducer'
import { useDispatch, useSelector, useStore } from '../provider'
import { UseFlowerForm } from './types/FlowerHooks'

/**  This hook allows you to manage and retrieve information about Forms.
 *
 * It exposes details regarding the form's state and a set of methods for reading and writing within it:
 *
 * - isSubmitted,
 * - isDirty,
 * - errors,
 * - customErrors,
 * - isValid,
 * - isValidating,
 * - getData,
 * - setData,
 * - unsetData,
 * - replaceData,
 * - reset,
 * - setCustomErrors
 * - getFormStatus
 *
 * @param {string} flowName - first optional parameter
 *
 * @param {string} name - alias optional parameter, if flowName exist, name is not used
 *
 */
const useFlowerForm: UseFlowerForm = ({
  flowName: customFlowName,
  name
} = {}) => {
  const { formName: formNameDefault } = useContext(context) // TODO: WIP, needs to be refactored

  const dispatch = useDispatch()
  const store = useStore()
  const flowName = customFlowName || name || formNameDefault || ''
  const currentNode = useSelector(makeSelectCurrentNodeId(flowName))
  const {
    errors,
    customErrors,
    isValid,
    isSubmitted,
    isDirty,
    hasFocus,
    isValidating
  } = useSelector(makeSelectNodeErrors(flowName))

  const getData = useCallback(
    (path?: string) => {
      const { flowNameFromPath = flowName, path: newpath } =
        CoreUtils.getPath(path)
      return get(store.getState(), [
        'flower',
        flowNameFromPath,
        'data',
        ...newpath
      ])
    },
    [store, flowName]
  )

  const getFormStatus = useCallback(
    (path?: string) => {
      const { flowNameFromPath = flowName, path: newpath } =
        CoreUtils.getPath(path)
      return get(store.getState(), [
        'flower',
        flowNameFromPath,
        'form',
        ...newpath
      ])
    },
    [store, flowName]
  )

  const setDataField = useCallback(
    (id: string, val: any, dirty = true) => {
      dispatch(
        actions.addDataByPath({
          formName: currentNode,
          id,
          value: val,
          dirty
        })
      )
      return
    },
    [currentNode, dispatch]
  )

  const setData = useCallback(
    (val: any, id?: string) => {
      if (id) {
        setDataField(id, val)
        return
      }
      dispatch(actions.addData({ formName: currentNode, value: val }))
    },
    [currentNode, setDataField, dispatch]
  )

  const unsetData = useCallback(
    (path: string) => {
      const { path: newpath } = CoreUtils.getPath(path)
      dispatch(actions.unsetData({ formName: currentNode, id: newpath })) // What is this id parameter?
    },
    [currentNode, dispatch]
  )

  const replaceData = useCallback(
    (val: any) => {
      dispatch(actions.replaceData({ formName: currentNode, value: val }))
    },
    [currentNode, dispatch]
  )

  const reset = useCallback(
    (nodeId?: string) => {
      dispatch(
        actions.resetForm({ formName: currentNode, id: nodeId || currentNode }) // What is this id parameter?
      )
    },
    [currentNode, dispatch]
  )

  const setCustomErrors = useCallback(
    // Is `nodeId` needed?
    (field: string, errors: string[], nodeId?: string) => {
      dispatch(
        actions.formAddCustomErrors({
          formName: currentNode,
          id: field,
          errors
        })
      )
    },
    [currentNode, dispatch]
  )

  return {
    isSubmitted,
    isDirty,
    hasFocus,
    errors,
    customErrors,
    isValid,
    isValidating,
    getData,
    setData,
    setDataField,
    unsetData,
    replaceData,
    reset,
    setCustomErrors,
    getFormStatus
  }
}

export default useFlowerForm
