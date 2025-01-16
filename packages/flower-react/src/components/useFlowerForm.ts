import { useCallback, useContext } from 'react'
import { CoreUtils, REDUCER_NAME } from '@flowerforce/flower-core'
import get from 'lodash/get'
import { FormContext } from '../context/formcontext'
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
 * @param {string} customFormName - Pass this prop if useFlowerForm its used outside FlowerForm Context to choose which form you need
 *
 */
const useFlowerForm: UseFlowerForm = (customFormName) => {
  const { formName: formNameDefault, initialData } = useContext(FormContext) // TODO: WIP, needs to be refactored

  const dispatch = useDispatch()
  const store = useStore()
  const formName = (formNameDefault || customFormName) as string
  const currentNode = useSelector(makeSelectCurrentNodeId(formName))
  const {
    errors,
    customErrors,
    isValid,
    isSubmitted,
    isDirty,
    hasFocus,
    isValidating
  } = useSelector(makeSelectNodeErrors(formName))

  const getData = useCallback(
    (path?: string) => {
      const { formName: formNameFromPath = formName, path: newpath } =
        CoreUtils.getPath(path)
      return get(store.getState(), [
        REDUCER_NAME.FLOWER_DATA,
        formNameFromPath,
        'data',
        ...newpath
      ])
    },
    [store, formName]
  )

  const getFormStatus = useCallback(() => {
    return get(store.getState(), [REDUCER_NAME.FLOWER_DATA, formName])
  }, [store, formName])

  const setDataField = useCallback(
    (id: string, val: any, dirty = true) => {
      dispatch(
        actions.addDataByPath({
          formName,
          id,
          value: val,
          dirty
        })
      )
      return
    },
    [dispatch, formName]
  )

  const setData = useCallback(
    (val: any, id?: string) => {
      if (id) {
        setDataField(id, val)
        return
      }
      dispatch(actions.addData({ formName, value: val }))
    },
    [dispatch, formName, setDataField]
  )

  const unsetData = useCallback(
    (path: string) => {
      const { path: newpath } = CoreUtils.getPath(path)
      dispatch(actions.unsetData({ formName, id: newpath })) // What is this id parameter?
    },
    [dispatch, formName]
  )

  const replaceData = useCallback(
    (val: any) => {
      dispatch(actions.replaceData({ formName, value: val }))
    },
    [dispatch, formName]
  )

  const reset = useCallback(() => {
    dispatch(
      actions.resetForm({
        formName,
        initialData
      })
    )
  }, [dispatch, formName, initialData])

  const setCustomErrors = useCallback(
    (field: string, errors: string[]) => {
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
