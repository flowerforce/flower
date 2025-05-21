import {
  Edge,
  MapEdge,
  NodeConfig,
  RulesByNodeId
} from '@flowerforce/flower-core'
import { Children } from 'react'

export type GenerateNodesForFlowerJson = (
  nodes: ReturnType<typeof Children.toArray>,
  edges?: Edge[]
) => NodeConfig[]

export type GetRulesExists = (
  rules: RulesByNodeId<any>[]
) => ReturnType<MapEdge> | undefined
