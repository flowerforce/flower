import React, { useEffect } from 'react'
import { FlowerNodeDefaultProps } from '../types/DefaultNode'

const FlowAction = ({ children, onEnter, onExit }: FlowerNodeDefaultProps) => {
  useEffect(() => {
    onEnter?.()
    return () => {
      onExit?.()
    }
  }, [onEnter, onExit])
  return <>{children}</>
}

const component = React.memo(FlowAction)
component.displayName = 'FlowerAction'

export const FlowerAction = component as typeof FlowAction
