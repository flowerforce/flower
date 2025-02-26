import React, { useEffect, memo } from 'react'
import { FlowerNodeProps } from '../types/FlowerNode'

const _FlowerNode = ({ children, onEnter, onExit }: FlowerNodeProps) => {
  useEffect(() => {
    onEnter?.()
    return () => {
      onExit?.()
    }
  }, [onEnter, onExit])

  return <>{children}</>
}

const component = memo(_FlowerNode)
component.displayName = 'FlowerNode'

export const FlowerNode = component as typeof _FlowerNode
