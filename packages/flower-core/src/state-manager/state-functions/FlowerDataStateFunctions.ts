import _set from 'lodash/set'
import _unset from 'lodash/unset'
import _get from 'lodash/get'
import { CoreUtils } from '../../utils/FlowerCoreUtils'
import { FormReducersFunctions } from '../../interfaces/ReducerInterface'

const { getPath } = CoreUtils
/**
 * formName => FlowerForm
 * initialData => FlowerForm
 * fieldName => FlowerField
 * fieldValue => FlowerField
 * errors => FlowerField
 * customErrors => FlowerField
 * fieldTouched => FlowerField
 * fieldDirty => FlowerField
 * fieldHasFocus => FlowerField
 */
export const FlowerCoreDataReducers: FormReducersFunctions = {
  setFormTouched: (state, { payload }) => {
    if (
      !_get(state, typeof payload === 'string' ? payload : payload.formName)
    ) {
      return state
    }
    _set(state, typeof payload === 'string' ? payload : payload.formName, true)
    return state
  },
  formAddCustomErrors: (state, { payload }) => {
    _set(state, [payload.formName, 'customErrors', payload.id], payload.errors)
  },
  formAddErrors: (state, { payload }) => {
    _set(state, [payload.formName, 'errors', payload.id], payload.errors)
  },
  formRemoveErrors: (state, { payload }) => {
    _unset(state, [payload.formName, 'errors', payload.id])
    _unset(state, [payload.formName, 'customErrors', payload.id])
    _unset(state, [payload.formName, 'isValidating'])
  },
  formFieldTouch: (state, { payload }) => {
    _set(state, [payload.formName, 'touches', payload.id], payload.touched)
  },
  formFieldDirty: (state, { payload }) => {
    _set(state, [payload.formName, 'dirty', payload.id], payload.dirty)
  },
  formFieldFocus: (state, { payload }) => {
    if (!payload.focused) {
      _unset(state, [payload.formName, 'hasFocus'])
      return
    }
    _set(state, [payload.formName, 'hasFocus'], payload.id)
  },
  addData: (state, { payload }) => {
    const prevData = _get(state, [payload.formName, 'data'], {})
    _set(state, [payload.formName, 'data'], { ...prevData, ...payload.value })
  },
  addDataByPath: (state, { payload }) => {
    const { path: newpath } = getPath(payload.id)

    if (payload.id && payload.id.length) {
      _set(state, [payload.formName, 'data', ...newpath], payload.value)
      if (payload && payload.dirty) {
        _set(state, [payload.formName, 'dirty', payload.id], payload.dirty)
      }
    }
  },
  // TODO usato al momento solo il devtool
  replaceData: /* istanbul ignore next */ (state, { payload }) => {
    /* istanbul ignore next */
    _set(state, [payload.formName, 'data'], payload.value)
  },
  unsetData: (state, { payload }) => {
    _unset(state, [payload.formName, 'data', ...payload.id])
  },
  setFormIsValidating: (state, { payload }) => {
    _set(state, [payload.formName, 'isValidating'], payload.isValidating)
  },
  resetForm: (state, { payload: { formName, initialData } }) => {
    const touchedFields = _get(state, [formName, 'errors'], {})

    const newStateData = initialData
      ? Object.keys(touchedFields).reduce((acc, key) => {
          const { path } = getPath(key)
          const initialDataByPath = _get(initialData, [...path], undefined)
          _set(acc, [...path], initialDataByPath)
          return acc
        }, {})
      : {}

    _set(state, [formName, 'data'], newStateData)
    _unset(state, [formName, 'touches'])
    _unset(state, [formName, 'dirty'])
    _unset(state, [formName, 'isSubmitted'])
  },
  initForm: (state, { payload: { formName, initialData } }) => {
    _set(state, [formName, 'data'], initialData)
  }
}
