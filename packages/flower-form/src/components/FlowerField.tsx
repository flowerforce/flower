/* eslint-disable */
import React, {
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef
} from 'react'
import {
  getDataFromState,
  makeSelectFieldError,
  makeSelectNodeFieldDirty,
  makeSelectNodeFieldFocused,
  makeSelectNodeFieldTouched,
  makeSelectNodeFormSubmitted
} from '../selectors'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import FlowerRule from './FlowerRule'

import debounce from 'lodash/debounce'
import {
  flowerDataActions,
  useDispatch,
  useSelector,
  useStore
} from '@flowerforce/flower-react-store'
import {
  MatchRules,
  CoreUtils,
  FlowerStateUtils
} from '@flowerforce/flower-core'
import { FlowerFieldProps } from './types/FlowerField'
import isEqual from 'lodash/isEqual'

function isIntrinsicElement(x: unknown): x is keyof JSX.IntrinsicElements {
  return typeof x === 'string'
}

//TODO make types for wrapper function props
function Wrapper({
  Component,
  id,
  formName,
  validate,
  asyncDebounce = 0,
  asyncValidate,
  asyncInitialError,
  asyncWaitingError,
  destroyValue,
  destroyOnHide,
  onBlur,
  onFocus,
  hidden,
  onUpdate,
  defaultValue,
  ...props
}: any) {
  const dispatch = useDispatch()

  const [customAsyncErrors, setCustomAsyncErrors] = useState(
    asyncValidate && asyncInitialError && [asyncInitialError]
  )
  const [isValidating, setIsValidating] = useState<boolean | undefined>(
    undefined
  )

  const { formName: formNameFromPath = formName, path } = useMemo(
    () => CoreUtils.getPath(id),
    [id]
  )

  const value = useSelector(getDataFromState(formName, path))
  const errors = useSelector(
    makeSelectFieldError(formName, id, validate),
    CoreUtils.allEqual
  )
  const dirty = useSelector(makeSelectNodeFieldDirty(formName, formName, id))
  const touched = useSelector(
    makeSelectNodeFieldTouched(formName, formName, id)
  )
  const focused = useSelector(
    makeSelectNodeFieldFocused(formName, formName, id)
  )

  const refValue = useRef<Record<string, any>>()

  const isSubmitted = useSelector(
    makeSelectNodeFormSubmitted(formName, formName)
  )

  const store = useStore()

  const allErrors = useMemo(
    () =>
      hidden ? [] : [...errors, ...(customAsyncErrors || []).filter(Boolean)],
    [errors, hidden, customAsyncErrors]
  )

  const setTouched = useCallback(
    (touched: boolean) => {
      dispatch(
        flowerDataActions.formFieldTouch({
          formName: formName,
          id,
          touched
        })
      )
    },
    [dispatch, formName, id]
  )

  const setFocus = useCallback(
    (focused: boolean) => {
      dispatch(
        flowerDataActions.formFieldFocus({
          formName: formName,
          id,
          focused
        })
      )
    },
    [dispatch, formName, id]
  )

  const validateFn = useCallback(
    async (value: any) => {
      if (asyncWaitingError) {
        setCustomAsyncErrors([asyncWaitingError])
      }
      setIsValidating(true)
      const state = FlowerStateUtils.getAllData(store)
      const res = await asyncValidate(value, state, errors)
      setIsValidating(false)
      setCustomAsyncErrors(res)
    },
    [asyncWaitingError, errors]
  )

  const debouncedValidation = useCallback(debounce(validateFn, asyncDebounce), [
    validateFn
  ])

  const onChange = useCallback(
    (val: any) => {
      if (asyncValidate && asyncWaitingError) {
        setCustomAsyncErrors([asyncWaitingError])
      }
      dispatch(
        flowerDataActions.addDataByPath({
          formName: formName,
          id,
          value: val,
          dirty: defaultValue ? !isEqual(val, defaultValue) : true
        })
      )
    },
    [
      id,
      formName,
      dispatch,
      setCustomAsyncErrors,
      asyncValidate,
      asyncWaitingError
    ]
  )

  const onBlurInternal = useCallback(
    (e: Event) => {
      setTouched(true)
      setFocus(false)
      onBlur && onBlur(e)
    },
    [onBlur, setTouched, setFocus]
  )

  const onFocusInternal = useCallback(
    (e: Event) => {
      setFocus(true)
      onFocus && onFocus(e)
    },
    [onFocus, setFocus]
  )

  useEffect(() => {
    if (hidden) return
    if (asyncValidate) {
      if (refValue.current === value) return
      refValue.current = value

      const hasValue = !MatchRules.utils.isEmpty(value)

      if (!hasValue) {
        setCustomAsyncErrors(asyncInitialError && [asyncInitialError])
        setIsValidating(false)
        return
      }

      setTouched(true)
      debouncedValidation(value)
    }
  }, [
    asyncValidate,
    asyncInitialError,
    value,
    debouncedValidation,
    setTouched,
    hidden
  ])

  useEffect(() => {
    if (onUpdate) {
      onUpdate(value)
    }
  }, [value, onUpdate])

  useEffect(() => {
    dispatch(
      flowerDataActions.formAddErrors({
        formName,
        id,
        errors: allErrors
      })
    )
  }, [id, allErrors, formName, touched])

  useEffect(() => {
    dispatch(
      flowerDataActions.setFormIsValidating({
        formName,
        isValidating
      })
    )
  }, [formName, isValidating])

  const resetField = useCallback(() => {
    dispatch(
      flowerDataActions.formFieldTouch({
        formName,
        id,
        touched: false
      })
    )
    dispatch(
      flowerDataActions.formFieldDirty({
        formName,
        id,
        dirty: false
      })
    )
    dispatch(
      flowerDataActions.formRemoveErrors({
        formName,
        id
      })
    )
  }, [formName, id])

  useEffect(() => {
    // destroy
    return () => {
      if (destroyValue) {
        dispatch(
          flowerDataActions.unsetData({
            formName,
            id: path
          })
        )
      }
      resetField()
    }
  }, [destroyValue, id, path, resetField])

  useEffect(() => {
    if (hidden) {
      if (destroyOnHide) {
        dispatch(flowerDataActions.unsetData({ formName: formName, id: path }))
        resetField()
      }
    }
  }, [destroyOnHide, hidden, formName, path, resetField])

  useEffect(() => {
    if (defaultValue && !dirty && !isEqual(value, defaultValue)) {
      onChange(defaultValue)
    }
  }, [defaultValue, value, dirty, onChange])

  const newProps = useMemo(
    () => ({
      ...props,
      id,
      value,
      errors: allErrors,
      hasError: !!allErrors.length,
      onChange,
      onBlur: onBlurInternal,
      onFocus: onFocusInternal,
      focused: !!focused,
      touched,
      dirty,
      hidden,
      isValidating,
      isSubmitted
    }),
    [
      props,
      id,
      value,
      allErrors,
      touched,
      dirty,
      onChange,
      onBlurInternal,
      onFocusInternal,
      hidden,
      isValidating,
      isSubmitted,
      focused
    ]
  )

  if (typeof Component === 'function') {
    return Component(newProps)
  }

  // TODO si arriva in questa condizione quando si passa un componente primitivo es. div
  // in questo caso non posso props custom di flower
  if (isIntrinsicElement(Component)) {
    return <Component id={id} {...props} />
  }

  return Component && <Component {...newProps} />
}

const FlowerField = ({
  id,
  validate,
  asyncValidate,
  asyncDebounce,
  asyncInitialError,
  asyncWaitingError,
  rules,
  alwaysDisplay,
  value,
  children,
  defaultValue,
  destroyOnHide,
  destroyValue,
  formName,
  onUpdate
}: FlowerFieldProps) => {
  const { name: formNameCtx, initialData } = useContext(FlowerReactContext)

  const name = formName || formNameCtx

  if (typeof children === 'function') {
    return (
      <FlowerRule
        alwaysDisplay={alwaysDisplay}
        rules={rules}
        value={value}
        formName={name}
        id={id}
      >
        {({ hidden }) => (
          <Wrapper
            hidden={hidden}
            id={id}
            Component={children}
            formName={name}
            validate={validate}
            asyncValidate={asyncValidate}
            asyncDebounce={asyncDebounce}
            asyncInitialError={asyncInitialError}
            asyncWaitingError={asyncWaitingError}
            destroyValue={destroyValue}
            onUpdate={onUpdate}
            defaultValue={defaultValue}
            destroyOnHide={destroyOnHide}
          />
        )}
      </FlowerRule>
    )
  }

  return React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) {
      return child
    }
    const { type, props } = child
    const Component = type
    return (
      <FlowerRule
        key={i}
        alwaysDisplay={alwaysDisplay}
        rules={rules}
        value={value}
        formName={name}
      >
        {({ hidden }) => (
          <Wrapper
            {...props}
            hidden={hidden}
            id={id}
            Component={Component}
            formName={name}
            validate={validate}
            asyncValidate={asyncValidate}
            asyncDebounce={asyncDebounce}
            asyncInitialError={asyncInitialError}
            asyncWaitingError={asyncWaitingError}
            destroyValue={destroyValue}
            onUpdate={onUpdate}
            defaultValue={defaultValue}
          />
        )}
      </FlowerRule>
    )
  })
}

const component = React.memo(FlowerField)
component.displayName = 'FlowerField'

export default component
