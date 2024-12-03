/* eslint-disable */
import React, {
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react'
import {
  getDataFromState,
  makeSelectFieldError,
  makeSelectNodeFieldDirty,
  makeSelectNodeFieldFocused,
  makeSelectNodeFieldTouched,
  makeSelectNodeFormSubmitted
} from '../selectors'
import { context } from '../context/flowcontext'
import FlowerRule from './FlowerRule'
import { store, useDispatch, useSelector } from '../provider'
import debounce from 'lodash/debounce'
import {
  MatchRules,
  CoreUtils,
  FlowerStateUtils
} from '@flowerforce/flower-core'
import { FlowerFieldProps } from './types/FlowerField'
import isEqual from 'lodash/isEqual'
import { actions } from '../reducer/formReducer'
function isIntrinsicElement(x: unknown): x is keyof JSX.IntrinsicElements {
  return typeof x === 'string'
}

//TODO make types for wrapper function props
function Wrapper({
  Component,
  id,
  flowName,
  currentNode,
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

  const { flowNameFromPath = flowName, path } = useMemo(
    () => CoreUtils.getPath(id),
    [id]
  )

  const value = useSelector(getDataFromState(flowNameFromPath, path))
  const errors = useSelector(
    makeSelectFieldError(flowName, id, validate),
    CoreUtils.allEqual
  )
  const dirty = useSelector(
    makeSelectNodeFieldDirty(flowName, currentNode, id)
  )
  const touched = useSelector(
    makeSelectNodeFieldTouched(flowName, currentNode, id)
  )
  const focused = useSelector(
    makeSelectNodeFieldFocused(flowName, currentNode, id)
  )

  const refValue = useRef<Record<string, any>>()

  const isSubmitted = useSelector(
    makeSelectNodeFormSubmitted(flowName, currentNode)
  )

  const allErrors = useMemo(
    () => hidden ? [] : [...errors, ...(customAsyncErrors || []).filter(Boolean)],
    [errors, hidden, customAsyncErrors]
  )

  const setTouched = useCallback((touched: boolean) => {
    dispatch(actions.formFieldTouch({
      name: flowName,
      id,
      currentNode,
      touched
    }))
  }, [dispatch, flowName, currentNode, id])

  const setFocus = useCallback((focused: boolean) => {
    dispatch(actions.formFieldFocus({
      name: flowName,
      id,
      currentNode,
      focused
    }))
  }, [dispatch, flowName, currentNode, id])

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
      dispatch(actions.addDataByPath({
        flowName: flowNameFromPath,
        id,
        value: val,
        dirty: defaultValue ? !isEqual(val, defaultValue) : true
      }))
    },
    [flowNameFromPath, id, dispatch, setCustomAsyncErrors, asyncValidate, asyncWaitingError]
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
  }, [asyncValidate, asyncInitialError, value, debouncedValidation, setTouched, hidden])

  useEffect(() => {
    if (onUpdate) {
      onUpdate(value)
    }
  }, [value, onUpdate])


  useEffect(() => {
    dispatch(actions.formAddErrors({
      name: flowName,
      id,
      currentNode,
      errors: allErrors
    }))
  }, [id, flowName, allErrors, currentNode, touched])

  useEffect(() => {
    dispatch(actions.setFormIsValidating({
      name: flowName,
      currentNode,
      isValidating
    }
    ))
  }, [flowName, currentNode, isValidating])

  const resetField = useCallback(() => {
    dispatch(actions.formFieldTouch({
      name: flowName,
      id,
      currentNode,
      touched: false
    }
    ))
    dispatch(actions.formFieldDirty({
      name: flowName,
      id,
      currentNode,
      dirty: false
    }
    ))
    dispatch(actions.formRemoveErrors({
      name: flowName,
      id,
      currentNode
    }
    ))
  }, [currentNode, id, flowName])

  useEffect(() => {
    // destroy
    return () => {
      if (destroyValue) {
        dispatch(actions.unsetData({
          flowName: flowNameFromPath, id: path
        }
        ))
      }
      resetField()
    }
  }, [destroyValue, id, flowNameFromPath, path, resetField])

  useEffect(() => {
    if (hidden) {
      if (destroyOnHide) {
        dispatch(actions.unsetData({ flowName: flowNameFromPath, id: path }))
        resetField()
      }
    }
  }, [destroyOnHide, hidden, flowNameFromPath, path, resetField])

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
      isSubmitted,
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
  flowName,
  onUpdate
}: FlowerFieldProps) => {
  const { flowName: flowNameContext, currentNode } = useContext(context)

  const name = flowName || flowNameContext

  if (typeof children === 'function') {
    return (
      <FlowerRule
        alwaysDisplay={alwaysDisplay}
        rules={rules}
        value={value}
        flowName={name}
        id={id}
      >
        {({ hidden }) => (
          <Wrapper
            hidden={hidden}
            id={id}
            Component={children}
            flowName={name}
            currentNode={currentNode}
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
        flowName={name}
      >
        {({ hidden }) => (
          <Wrapper
            {...props}
            hidden={hidden}
            id={id}
            Component={Component}
            flowName={name}
            currentNode={currentNode}
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
