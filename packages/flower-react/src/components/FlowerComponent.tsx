import { memo } from 'react'
import { FlowerComponentProps } from '../types/FlowerComponent'

const _FlowerComponent = ({ children }: FlowerComponentProps) => children

const component = memo(_FlowerComponent)

export const FlowerComponent = component as typeof _FlowerComponent
