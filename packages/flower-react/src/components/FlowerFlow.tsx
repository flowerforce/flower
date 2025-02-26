import React, { useEffect } from 'react'
import { FlowerFlowProps } from '../types/FlowerFlow'

const _FlowerFlow = ({ children, onEnter, onExit }: FlowerFlowProps) => {
  useEffect(() => {
    onEnter?.()
    return () => {
      onExit?.()
    }
  }, [onEnter, onExit])
  return <>{children}</>
}

const component = React.memo(_FlowerFlow)
component.displayName = 'FlowerFlow'

export const FlowerFlow = component as typeof _FlowerFlow
