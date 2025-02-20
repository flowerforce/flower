import React, { useContext, useEffect, useRef } from 'react'
import { useDispatch } from '@flowerforce/flower-react-store'
import { FlowerRouteProps } from './types/FlowerRoute'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import { actions as flowerActions } from '../reducer/flowerReducer'

const FlowerRoute = ({
  autostart = true,
  children,
  onEnter,
  onExit
}: FlowerRouteProps) => {
  const dispatch = useDispatch()
  const one = useRef(false)
  const { name } = useContext(FlowerReactContext)

  useEffect(() => {
    onEnter?.()
    return () => {
      onExit?.()
    }
  }, [onEnter, onExit])

  useEffect(() => {
    if (autostart && one.current === false) {
      one.current = true
      dispatch(flowerActions.next({ flowName: name }))
    }
  }, [dispatch, name, autostart])

  return <>{children}</>
}

const component = React.memo(FlowerRoute)
component.displayName = 'FlowerRoute'

export default component as typeof FlowerRoute
