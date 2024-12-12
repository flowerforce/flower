/* eslint-disable */
import React from 'react';
import { useFlowerNavigate } from './useFlowerNavigate';
import WrapperComponent from './WrapperComponent'
import FlowerRule from '../FlowerRule';
import { FlowerNavigateProps } from '../types/FlowerNavigate';

//TODO type RenderRules props
// ! Probably in this scenario we must replace `FlowerRule` or refactor `FlowerNavigate`
const RenderRules = ({ alwaysDisplay, rules, Component, flowName, onNavigate, ...props }: any) => {
  return (
    <FlowerRule alwaysDisplay={alwaysDisplay} rules={rules} formName={flowName}>
      {({ hidden }) => <WrapperComponent
        {...props}
        Component={Component}
        hidden={hidden}
        onNavigate={onNavigate}
      />}
    </FlowerRule>
  )
}

const FlowerNavigate = ({
  children,
  flowName: forceFlowName,
  action,
  route,
  node,
  rules,
  alwaysDisplay,
}: FlowerNavigateProps) => {
  const { onNavigate, flowName } = useFlowerNavigate({ flowName: forceFlowName, action, route, node })
  if (typeof children === 'function') {
    return <RenderRules
      alwaysDisplay={alwaysDisplay}
      rules={rules}
      Component={children}
      flowName={flowName}
      onNavigate={onNavigate}
    />
  }

  return React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) return child
    const { type, props } = child
    const Component = type;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <RenderRules
      key={i}
      alwaysDisplay={alwaysDisplay}
      rules={rules}
      Component={Component}
      flowName={flowName}
      onNavigate={onNavigate}
      {...props}
    />
  });
}

const component = React.memo(FlowerNavigate);
component.displayName = 'FlowerNavigate';

export default component;
