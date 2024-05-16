import React from 'react'
import { FlowerComponentProps } from './types/FlowerComponent'

const FlowerComponent = ({ children }: FlowerComponentProps) => children

export default React.memo(FlowerComponent)
