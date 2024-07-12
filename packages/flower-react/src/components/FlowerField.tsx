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
  makeSelectNodeFieldTouched,
  makeSelectNodeFormTouched
} from '../selectors'
import { context } from '../context'
import FlowerRule from './FlowerRule'
import { store, useDispatch, useSelector } from '../provider'
import debounce from 'lodash/debounce'
import {
  MatchRules,
  CoreUtils,
  FlowerStateUtils
} from '@flowerforce/flower-core'
import { FlowerFieldProps } from './types/FlowerField'

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
  onBlur = (val: any) => null,
  hidden,
  onUpdate,
  defaultValue,
  ...props
}: any) {
  const dispatch = useDispatch()

  const [customErrors, setCustomErrors] = useState(
    asyncValidate && [asyncInitialError]
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
  const touched = useSelector(
    makeSelectNodeFieldTouched(flowName, currentNode, id)
  )
  const refValue = useRef<Record<string, any>>()
  const one = useRef<boolean>()
  const touchedForm = useSelector(
    makeSelectNodeFormTouched(flowName, currentNode)
  )

  const allErrors = useMemo(
    () => [...errors, ...(customErrors || []).filter(Boolean)],
    [errors, customErrors]
  )
  const isTouched = touched || touchedForm

  const setTouched = useCallback((touched: boolean) => {
    dispatch({
      type: 'flower/formFieldTouch',
      payload: {
        name: flowName,
        id,
        currentNode,
        touched
      }
    })  
  }, [dispatch, flowName, currentNode, id])

  const validateFn = useCallback(
    async (value: any) => {
      if (asyncWaitingError) {
        setCustomErrors([asyncWaitingError])
      }
      setIsValidating(true)
      const state = FlowerStateUtils.getAllData(store)
      const res = await asyncValidate(value, state, errors)
      setIsValidating(false)
      setCustomErrors(res)
    },
    [asyncWaitingError, errors]
  )

  const debouncedValidation = useCallback(debounce(validateFn, asyncDebounce), [
    validateFn
  ])

  const onChange = useCallback(
    (val: any) => {
      dispatch({
        type: `flower/addDataByPath`,
        payload: {
          flowName: flowNameFromPath,
          id: path,
          value: val
        }
      })
    },
    [flowNameFromPath, path, onBlur, dispatch]
  )

  const onBlurInternal = useCallback(
    (e: Event) => {
      setTouched(true)
      onBlur && onBlur(e)
    },
    [onBlur]
  )
  
  useEffect(() => {
    if (asyncValidate) {
      if (refValue.current === value) return
      refValue.current = value

      const hasValue = !MatchRules.utils.isEmpty(value)

      if (!hasValue) {
        setCustomErrors([asyncInitialError])
        setIsValidating(false)
        return
      }

      setTouched(true)
      debouncedValidation(value)
    }
  }, [asyncValidate, asyncInitialError, value, debouncedValidation])

  useEffect(() => {
    if (onUpdate) {
      onUpdate(value)
    }
  }, [value, onUpdate])

  useEffect(()=>{
    if(value){
      setTouched(true)
    }
  },[value, setTouched])

  useEffect(() => {
    dispatch({
      type: 'flower/formAddErrors',
      payload: {
        name: flowName,
        id,
        currentNode,
        errors: allErrors
      }
    })
  }, [id, flowName, allErrors, currentNode, touched])

  useEffect(() => {
    dispatch({
      type: 'flower/setFormIsValidating',
      payload: {
        name: flowName,
        currentNode,
        isValidating
      }
    })
  }, [flowName, currentNode, isValidating])

  useEffect(() => {
    // destroy
    return () => {
      if (destroyValue) {
        dispatch({
          type: `flower/unsetData`,
          payload: { flowName: flowNameFromPath, id: path }
        })
      }
      dispatch({
        type: 'flower/formRemoveErrors',
        payload: {
          name: flowName,
          id,
          currentNode
        }
      })
    }
  }, [destroyValue])

  useEffect(() => {
    if(!isTouched){
      one.current = false
    }
    if (defaultValue && !one.current) {
      one.current = true
      onChange(defaultValue)
    }
  }, [defaultValue, isTouched, onChange])


  const newProps = useMemo(
    () => ({
      ...props,
      id,
      value,
      errors: isTouched && allErrors,
      hasError: isTouched && !!allErrors.length,
      onChange,
      onBlur: onBlurInternal,
      isTouched,
      hidden,
      isValidating
    }),
    [
      props,
      id,
      value,
      allErrors,
      isTouched,
      onChange,
      onBlurInternal,
      hidden,
      isValidating
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
  destroyValue,
  flowName,
  onUpdate
}: FlowerFieldProps<any>) => {
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
