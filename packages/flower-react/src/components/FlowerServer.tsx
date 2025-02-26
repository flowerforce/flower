import React from 'react'
import { FlowerServerProps } from '../types/FlowerServer'

const _FlowerServer = ({ children }: FlowerServerProps) => {
  return <>{children}</>
}

const component = React.memo(_FlowerServer)
component.displayName = 'FlowerServer'

export const FlowerServer = component as typeof _FlowerServer
