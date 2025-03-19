import { useCallback, useContext, useMemo } from 'react'
import { CoreUtils, REDUCER_NAME } from '@flowerforce/flower-core'
import get from 'lodash/get'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import {
  flowerDataActions,
  ReduxFlowerProvider
} from '@flowerforce/flower-react-store'
import type { UseFlowerForm } from '../../types'
import { makeSelectNodeErrors } from '../../selectors'

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
export const useFlowerForm: UseFlowerForm = (customFormName) => {
  const { name: formNameDefault, initialData } = useContext(FlowerReactContext) // TODO: WIP, needs to be refactored

  const { dispatch, store, useSelector } = ReduxFlowerProvider.getReduxHooks()

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
    const { FlowerFlow, FlowerData, ...rest } = store.getState() as any
    return {
      ...FlowerData,
      ...rest
    }
  }, [])

  const getExternalReducersData = useCallback(() => {
    const { FlowerFlow, FlowerData, ...rest } = store.getState() as any
    return rest
  }, [])

  const getData = useCallback(
    (path?: string) => {
      const { rootName: formNameFromPath = formName, path: newpath } =
        CoreUtils.getPath(path)
      return get(store.getState(), [
        REDUCER_NAME.FLOWER_DATA,
        formNameFromPath,
        'data',
        ...newpath
      ])
    },
    [formName]
  )

  const getFormStatus = useCallback(() => {
    return get(store.getState(), [REDUCER_NAME.FLOWER_DATA, formName])
  }, [formName])

  const setDataField = useCallback(
    (id: string, val: any, dirty = true) => {
      dispatch(
        flowerDataActions.addDataByPath({
          rootName: formName,
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
      dispatch(flowerDataActions.addData({ rootName: formName, value: val }))
    },
    [dispatch, formName, setDataField]
  )

  const unsetData = useCallback(
    (path: string) => {
      const { path: newpath } = CoreUtils.getPath(path)
      dispatch(flowerDataActions.unsetData({ rootName: formName, id: newpath })) // What is this id parameter?
    },
    [dispatch, formName]
  )

  const replaceData = useCallback(
    (val: any) => {
      dispatch(
        flowerDataActions.replaceData({ rootName: formName, value: val })
      )
    },
    [dispatch, formName]
  )

  const reset = useCallback(() => {
    dispatch(
      flowerDataActions.resetData({
        rootName: formName,
        initialData: initialData as Record<string, unknown>
      })
    )
  }, [dispatch, formName, initialData])

  const setCustomErrors = useCallback(
    (field: string, errors: string[]) => {
      dispatch(
        flowerDataActions.addCustomDataErrors({
          rootName: formName,
          id: field,
          errors
        })
      )
    },
    [dispatch, formName]
  )

  const setFormSubmitted = useCallback(() => {
    dispatch(
      flowerDataActions.setFormSubmitted({
        rootName: formName
      })
    )
  }, [dispatch, formName])

  const result = useMemo(
    () => ({
      isSubmitted,
      isDirty,
      hasFocus,
      errors,
      customErrors,
      isValid,
      isValidating,
      setFormSubmitted,
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
      setFormSubmitted,
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
