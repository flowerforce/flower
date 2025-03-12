/* eslint-disable */
import React from 'react'
import { useFlowerNavigate } from './useFlowerNavigate'
import { FlowerNavigateWrapper } from './WrapperComponent'
import { FlowerRule } from '@flowerforce/flower-react-shared'

import { FlowerNavigateProps } from '../../types/FlowerNavigate'

//TODO type RenderRules props
// ! Probably in this scenario we must replace `FlowerRule` or refactor `FlowerNavigate`
const RenderRules = ({
  alwaysDisplay,
  rules,
  Component,
  flowName,
  onNavigate,
  ...props
}: any) => {
  return (
    <FlowerRule alwaysDisplay={alwaysDisplay} rules={rules} rootName={flowName}>
      {({ hidden }) => (
        <FlowerNavigateWrapper
          {...props}
          Component={Component}
          hidden={hidden}
          onNavigate={onNavigate}
        />
      )}
    </FlowerRule>
  )
}

const _FlowerNavigate = ({
  children,
  flowName: forceFlowName,
  action,
  route,
  node,
  rules,
  alwaysDisplay
}: FlowerNavigateProps) => {
  const { onNavigate, flowName } = useFlowerNavigate({
    flowName: forceFlowName,
    action,
    route,
    node
  })
  if (typeof children === 'function') {
    return (
      <RenderRules
        alwaysDisplay={alwaysDisplay}
        rules={rules}
        Component={children}
        flowName={flowName}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child
        const { type, props } = child
        const Component = type

        return (
          <RenderRules
            key={i}
            alwaysDisplay={alwaysDisplay}
            rules={rules}
            Component={Component}
            flowName={flowName}
            onNavigate={onNavigate}
            {...(props as Record<string, unknown>)}
          />
        )
      })}
    </>
  )
}

const component = React.memo(_FlowerNavigate)
component.displayName = 'FlowerNavigate'

export const FlowerNavigate = component as typeof _FlowerNavigate
