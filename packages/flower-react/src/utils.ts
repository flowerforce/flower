import { FlowUtils } from '@flowerforce/flower-core'
import get from 'lodash/get'
import React from 'react'
import { GetRulesExists, GenerateNodesForFlowerJson } from './types/utilsTypes'

const getRulesExists: GetRulesExists = (rules) => {
  return Object.keys(rules).length ? FlowUtils.mapEdge(rules) : undefined
}

function hasDisplayName(
  type: unknown
): type is React.JSXElementConstructor<any> & { displayName: string } {
  return (
    typeof type === 'function' &&
    'displayName' in type &&
    typeof (type as any).displayName === 'string'
  )
}

export const generateNodesForFlowerJson: GenerateNodesForFlowerJson = (nodes) =>
  nodes
    .filter(
      (child): child is React.ReactElement =>
        typeof child === 'object' && child !== null && 'props' in child
    )
    .filter((e) => !!get(e, 'props.id'))
    .map((e) => {
      const rules = FlowUtils.makeRules(e.props.to ?? {})
      const nextRules = getRulesExists(rules)
      const children = e.props.data?.children
      const nodeType = hasDisplayName(e.type)
        ? e.type.displayName
        : e.props.as || 'FlowerNode'
      return {
        nodeId: e.props.id,
        nodeType,
        nodeTitle: get(e.props, 'data.title'),
        children,
        nextRules,
        retain: e.props.retain,
        disabled: e.props.disabled
      }
    })
