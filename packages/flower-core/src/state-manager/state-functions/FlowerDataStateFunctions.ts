import _set from 'lodash/set'
import _unset from 'lodash/unset'
import _get from 'lodash/get'
import { CoreUtils } from '../../utils/FlowerCoreUtils'
import { DataReducersFunctions } from '../../interfaces/ReducerInterface'

const { getPath } = CoreUtils
export const FlowerCoreDataReducers: DataReducersFunctions = {
  setFormSubmitted: (state, { payload }) => {
    const rootPath = typeof payload === 'string' ? payload : payload.rootName
    if (!_get(state, [rootPath])) {
      return state
    }
    _set(state, [rootPath, 'isSubmitted'], true)
    return state
  },
  addCustomDataErrors: (state, { payload }) => {
    _set(state, [payload.rootName, 'customErrors', payload.id], payload.errors)
  },
  addDataErrors: (state, { payload }) => {
    _set(state, [payload.rootName, 'errors', payload.id], payload.errors)
  },
  removeDataErrors: (state, { payload }) => {
    _unset(state, [payload.rootName, 'errors', payload.id])
    _unset(state, [payload.rootName, 'customErrors', payload.id])
    _unset(state, [payload.rootName, 'isValidating'])
  },
  fieldTouch: (state, { payload }) => {
    _set(state, [payload.rootName, 'touches', payload.id], payload.touched)
  },
  fieldDirty: (state, { payload }) => {
    _set(state, [payload.rootName, 'dirty', payload.id], payload.dirty)
  },
  fieldFocus: (state, { payload }) => {
    if (!payload.focused) {
      _unset(state, [payload.rootName, 'hasFocus'])
      return
    }
    _set(state, [payload.rootName, 'hasFocus'], payload.id)
  },
  addData: (state, { payload }) => {
    const prevData = _get(state, [payload.rootName, 'data'], {})
    _set(state, [payload.rootName, 'data'], { ...prevData, ...payload.value })
  },
  addDataByPath: (state, { payload }) => {
    const { path: newpath } = getPath(payload.id)

    if (payload.id && payload.id.length) {
      _set(state, [payload.rootName, 'data', ...newpath], payload.value)
      if (payload && payload.dirty) {
        _set(state, [payload.rootName, 'dirty', payload.id], payload.dirty)
      }
    }
  },
  // TODO usato al momento solo il devtool
  replaceData: /* istanbul ignore next */ (state, { payload }) => {
    /* istanbul ignore next */
    _set(state, [payload.rootName, 'data'], payload.value)
  },
  unsetData: (state, { payload }) => {
    _unset(state, [payload.rootName, 'data', ...payload.id])
  },
  setIsDataValidating: (state, { payload }) => {
    _set(state, [payload.rootName, 'isValidating'], payload.isValidating)
  },
  resetData: (state, { payload: { rootName, initialData } }) => {
    const touchedFields = _get(state, [rootName, 'errors'], {})

    const newStateData = initialData
      ? Object.keys(touchedFields).reduce((acc, key) => {
          const { path } = getPath(key)
          const initialDataByPath = _get(initialData, [...path], undefined)
          _set(acc, [...path], initialDataByPath)
          return acc
        }, {})
      : {}

    _set(state, [rootName, 'data'], newStateData)
    _unset(state, [rootName, 'touches'])
    _unset(state, [rootName, 'dirty'])
    _unset(state, [rootName, 'isSubmitted'])
  },
  initData: (state, { payload: { rootName, initialData } }) => {
    _set(state, [rootName, 'data'], initialData)
  }
}
