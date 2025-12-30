import { useCallback, useContext } from 'react'
import get from 'lodash/get'
import { context } from '../context'
import { makeSelectCurrentNodeId, makeSelectNodeErrors } from '../selectors'
import { actions } from '../reducer'
import { useDispatch, useSelector, useStore } from '../provider'
import { setExternalValue } from '../externalState'
import { resolveFieldPath } from '@flowerforce/flower-core'
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
  const { flowName: flowNameDefault } = useContext(context)

  const dispatch = useDispatch()
  const store = useStore()
  const flowName = customFlowName || name || flowNameDefault || ''
  const currentNode = useSelector(makeSelectCurrentNodeId(flowName))
  const {
    errors,
    customErrors,
    isValid,
    isSubmitted,
    isDirty,
    hasFocus,
    isValidating
  } = useSelector(makeSelectNodeErrors(flowName, currentNode))

  const getData = useCallback(
    (path?: string) => {
      const {
        flowNameFromPath = flowName,
        path: newpath,
        externalPath
      } = resolveFieldPath(path, flowName)

      if (externalPath?.length) {
        return get(store.getState(), externalPath)
      }

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
      const { flowNameFromPath = flowName, path: newpath } = resolveFieldPath(
        path,
        flowName
      )
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
      const {
        flowNameFromPath = flowName,
        externalPath
      } = resolveFieldPath(id, flowName)

      if (externalPath?.length) {
        dispatch(setExternalValue(externalPath, val))
        return
      }

      dispatch(
        actions.addDataByPath({
          flowName: flowNameFromPath,
          id,
          value: val,
          dirty
        })
      )
      return
    },
    [flowName, dispatch]
  )

  const setData = useCallback(
    (val: any, id?: string) => {
      if (id) {
        setDataField(id, val)
        return
      }
      dispatch(actions.addData({ flowName, value: val }))
    },
    [flowName, setDataField, dispatch]
  )

  const unsetData = useCallback(
    (path: string) => {
      const {
        flowNameFromPath = flowName,
        path: newpath,
        externalPath
      } = resolveFieldPath(path, flowName)

      if (externalPath?.length) {
        dispatch(setExternalValue(externalPath, undefined))
        return
      }

      dispatch(actions.unsetData({ flowName: flowNameFromPath, id: newpath }))
    },
    [flowName, dispatch]
  )

  const replaceData = useCallback(
    (val: any) => {
      dispatch(actions.replaceData({ flowName, value: val }))
    },
    [flowName, dispatch]
  )

  const reset = useCallback(
    (nodeId?: string) => {
      dispatch(actions.resetForm({ flowName, id: nodeId || currentNode }))
    },
    [flowName, currentNode, dispatch]
  )

  const setCustomErrors = useCallback(
    (field: string, errors: string[], nodeId?: string) => {
      dispatch({
        type: 'flower/formAddCustomErrors',
        payload: {
          name: flowName,
          id: field,
          currentNode: nodeId || currentNode,
          errors
        }
      })
    },
    [flowName, currentNode, dispatch]
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
