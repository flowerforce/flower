/* eslint-disable */
import React, { useContext, useEffect, useMemo } from 'react';
import { CoreUtils } from '@flowerforce/flower-core';
import { useSelector } from '../provider';
import { getDataFromState } from '../selectors';
import { context } from '../context/formcontext';
import FlowerRule from './FlowerRule';
import { FlowerValueProps } from './types/FlowerValue';

//TODO make types for wrapper function
function Wrapper({
  Component,
  id,
  formName,
  spreadValue,
  hidden,
  onUpdate,
  ...props
}: any) {
  const { formName: formNameFromPath = formName, path } = useMemo(
    () => CoreUtils.getPath(id),
    [id]
  );
  const value = useSelector(getDataFromState(formName, path));
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
      formName={formName}
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
  formName,
  onUpdate,
  ...props
}: any) => {
  return (
    <FlowerRule
      alwaysDisplay={alwaysDisplay}
      rules={rules}
      value={value}
      formName={formName}
      id={id}
    >
      {({ hidden }) => (
        <Wrapper
          {...props}
          hidden={hidden}
          id={id}
          Component={Component}
          spreadValue={spreadValue}
          formName={formName}
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
  formId,
  onUpdate,
}: FlowerValueProps) => {
  const { formName: formNameCtx, initialData } = useContext(context);

  const name = formId || formNameCtx; // TODO: must read from formContext
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
        formName={name}
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
