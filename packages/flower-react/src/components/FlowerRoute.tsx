import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch } from '../provider'
import { context } from '../context'
import { FlowerRouteProps } from './types/FlowerRoute'

const FlowerRoute = ({
  autostart = true,
  children,
  onEnter,
  onExit
}: FlowerRouteProps) => {
  const dispatch = useDispatch()
  const one = useRef(false)
  const { flowName } = useContext(context)

  useEffect(() => {
    onEnter?.()
    return () => {
      onExit?.()
    }
  }, [onEnter, onExit])

  useEffect(() => {
    if (autostart && one.current === false) {
      one.current = true
      dispatch({ type: 'flower/next', payload: { flowName } })
    }
  }, [dispatch, flowName, autostart])

  return children
}

const component = React.memo(FlowerRoute)
component.displayName = 'FlowerRoute'

export default component
