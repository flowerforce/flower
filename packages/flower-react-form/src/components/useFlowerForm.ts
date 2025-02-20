import { useCallback, useContext, useMemo, useRef } from 'react'
import { CoreUtils, REDUCER_NAME } from '@flowerforce/flower-core'
import get from 'lodash/get'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import { makeSelectNodeErrors } from '../selectors'
import {
  flowerDataActions,
  useDispatch,
  useSelector,
  useStore
} from '@flowerforce/flower-react-store'
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
  const { name: formNameDefault, initialData } = useContext(FlowerReactContext) // TODO: WIP, needs to be refactored

  const dispatch = useDispatch()
  const store = useStore()

  const storeRef = useRef(store.getState())
  const formName = (formNameDefault || customFormName) as string
  const {
    errors,
    customErrors,
    isValid,
    isSubmitted,
    isDirty,
    hasFocus,
    isValidating
  } = useSelector(makeSelectNodeErrors(formName))

  const getGlobalData = useCallback(() => {
    const { FlowerFlow, FlowerData, ...rest } = storeRef.current
    return {
      ...FlowerData,
      ...rest
    }
  }, [])

  const getExternalReducersData = useCallback(() => {
    const { FlowerFlow, FlowerData, ...rest } = storeRef.current
    return rest
  }, [])

  const getData = useCallback(
    (path?: string) => {
      const { formName: formNameFromPath = formName, path: newpath } =
        CoreUtils.getPath(path)
      return get(storeRef.current, [
        REDUCER_NAME.FLOWER_DATA,
        formNameFromPath,
        'data',
        ...newpath
      ])
    },
    [formName]
  )

  const getFormStatus = useCallback(() => {
    return get(storeRef.current, [REDUCER_NAME.FLOWER_DATA, formName])
  }, [formName])

  const setDataField = useCallback(
    (id: string, val: any, dirty = true) => {
      dispatch(
        flowerDataActions.addDataByPath({
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
      dispatch(flowerDataActions.addData({ formName, value: val }))
    },
    [dispatch, formName, setDataField]
  )

  const unsetData = useCallback(
    (path: string) => {
      const { path: newpath } = CoreUtils.getPath(path)
      dispatch(flowerDataActions.unsetData({ formName, id: newpath })) // What is this id parameter?
    },
    [dispatch, formName]
  )

  const replaceData = useCallback(
    (val: any) => {
      dispatch(flowerDataActions.replaceData({ formName, value: val }))
    },
    [dispatch, formName]
  )

  const reset = useCallback(() => {
    dispatch(
      flowerDataActions.resetForm({
        formName,
        initialData: initialData as Record<string, unknown>
      })
    )
  }, [dispatch, formName, initialData])

  const setCustomErrors = useCallback(
    (field: string, errors: string[]) => {
      dispatch(
        flowerDataActions.formAddCustomErrors({
          formName,
          id: field,
          errors
        })
      )
    },
    [dispatch, formName]
  )

  const result = useMemo(
    () => ({
      isSubmitted,
      isDirty,
      hasFocus,
      errors,
      customErrors,
      isValid,
      isValidating,
      getGlobalData,
      getExternalReducersData,
      getData,
      setData,
      setDataField,
      unsetData,
      replaceData,
      reset,
      setCustomErrors,
      getFormStatus
    }),
    [
      customErrors,
      errors,
      getData,
      getExternalReducersData,
      getFormStatus,
      getGlobalData,
      hasFocus,
      isDirty,
      isSubmitted,
      isValid,
      isValidating,
      replaceData,
      reset,
      setCustomErrors,
      setData,
      setDataField,
      unsetData
    ]
  )

  return result
}

export default useFlowerForm
