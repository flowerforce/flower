import React from 'react'
import { FlowerServerProps } from './types/FlowerServer'

const FlowerServer = ({ children }: FlowerServerProps) => {
  return children
}

const component = React.memo(FlowerServer)
component.displayName = 'FlowerServer'

export default component
