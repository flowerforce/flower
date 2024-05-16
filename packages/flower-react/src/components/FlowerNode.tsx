import React, { useEffect, memo } from 'react'
import { FlowerNodeProps } from './types/FlowerNode'

const FlowerNode = ({ children, onEnter, onExit }: FlowerNodeProps) => {
  useEffect(() => {
    onEnter?.()
    return () => {
      onExit?.()
    }
  }, [onEnter, onExit])

  return children
}

const component = memo(FlowerNode)
component.displayName = 'FlowerNode'

export default component
