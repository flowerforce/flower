/* eslint-disable */
import React, { useMemo } from 'react';

function FlowerNavigateWrapper({
  Component,
  onNavigate,
  ...props
}) {
  
  const newProps = useMemo(() => ({
    ...props,
    // hidden,
    onPress: onNavigate
  }), [props, onNavigate])

  if (typeof Component === 'function') {
    return Component(newProps)
  }

  return <Component {...newProps} />

}

const component = React.memo(FlowerNavigateWrapper);

export default component;
