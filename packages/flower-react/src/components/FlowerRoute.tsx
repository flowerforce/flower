import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch, useStore } from '../provider'
import { context } from '../context'
import { FlowerRouteProps } from './types/FlowerRoute'

const FlowerRoute = ({
  autostart = true,
  children,
  onEnter,
  onExit
}: FlowerRouteProps) => {
  const dispatch = useDispatch()
  const store = useStore()
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
      dispatch({
        type: 'flower/next',
        payload: { flowName, rootState: store.getState() }
      })
    }
  }, [dispatch, flowName, autostart, store])

  return children
}

const component = React.memo(FlowerRoute)
component.displayName = 'FlowerRoute'

export default component
