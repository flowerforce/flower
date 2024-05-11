import React, { useContext, useEffect, useMemo } from 'react';
import { CoreUtils } from '@flowerforce/flower-core';
import { useSelector } from '../provider';
import { getDataFromState } from '../selectors';
import { FlowerCoreContext } from '../context';
import FlowerRule from './FlowerRule';
import { FlowerValueProps } from './types/FlowerValue';

function Wrapper({
  Component,
  id,
  flowName,
  spreadValue,
  hidden,
  onUpdate,
  ...props
}) {
  const { flowNameFromPath = flowName, path } = useMemo(
    () => CoreUtils.getPath(id),
    [id]
  );
  const value = useSelector(getDataFromState(flowNameFromPath, path));
  const values =
    spreadValue && typeof value === 'object' && !Array.isArray(value)
      ? value
      : { value };

  useEffect(() => {
    if (onUpdate) {
      onUpdate(value);
    }
  }, [onUpdate, value]);

  return (
    <Component
      id={id}
      {...props}
      flowName={flowName}
      hidden={hidden}
      {...values}
    />
  );
}

const RenderRules = ({
  id,
  alwaysDisplay,
  rules,
  value,
  Component,
  spreadValue,
  flowName,
  onUpdate,
  ...props
}) => {
  return (
    <FlowerRule
      alwaysDisplay={alwaysDisplay}
      rules={rules}
      value={value}
      flowName={flowName}
      id={id}
    >
      {({ hidden }) => (
        <Wrapper
          {...props}
          hidden={hidden}
          id={id}
          Component={Component}
          spreadValue={spreadValue}
          flowName={flowName}
          onUpdate={onUpdate}
        />
      )}
    </FlowerRule>
  );
};

const FlowerValue = ({
  id = '*',
  rules,
  alwaysDisplay,
  value,
  children,
  spreadValue,
  flowName,
  onUpdate,
}: FlowerValueProps) => {
  const { flowName: flowNameContext } = useContext(FlowerCoreContext);

  const name = flowName || flowNameContext;
  if (typeof children === 'function') {
    return (
      <RenderRules
        id={id}
        alwaysDisplay={alwaysDisplay}
        rules={rules}
        value={value}
        spreadValue={spreadValue}
        Component={children}
        flowName={name}
        onUpdate={onUpdate}
      />
    );
  }

  return React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) return child;
    const {type, props} = child
    const Component = type;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <RenderRules
        key={i}
        id={id}
        alwaysDisplay={alwaysDisplay}
        rules={rules}
        value={value}
        spreadValue={spreadValue}
        flowName={name}
        Component={Component}
        {...props}
        onUpdate={onUpdate}
      />
    );
  });
};

const component = React.memo(FlowerValue);
component.displayName = 'FlowerValue';

export default component;
