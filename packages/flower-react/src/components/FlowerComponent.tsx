import React, { memo } from 'react'
import { FlowerComponentProps } from './types/FlowerComponent'

const FlowerComponent = ({ children }: FlowerComponentProps) => children

const component = memo(FlowerComponent)

export default component
