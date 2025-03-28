import React, { useContext, useEffect, useRef } from 'react'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { FlowerRouteProps } from '../types/FlowerRoute'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import { flowerActions } from '../features'
const _FlowerRoute = ({
  autostart = true,
  children,
  onEnter,
  onExit
}: FlowerRouteProps) => {
  const { dispatch } = ReduxFlowerProvider.getReduxHooks()
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

const component = React.memo(_FlowerRoute)
component.displayName = 'FlowerRoute'

export const FlowerRoute = component as typeof _FlowerRoute
