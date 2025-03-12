/* eslint-disable */
import React, { useMemo } from 'react';

//TODO type FlowerNavigateWrapper props
function _FlowerNavigateWrapper({ Component, onNavigate, ...props }: any) {
  const newProps = useMemo(
    () => ({
      ...props,
      onPress: onNavigate,
    }),
    [props, onNavigate]
  );

  if (typeof Component === 'function') {
    return Component(newProps);
  }

  return <Component {...newProps} />;
}

const component = React.memo(_FlowerNavigateWrapper);

export const FlowerNavigateWrapper = component;
