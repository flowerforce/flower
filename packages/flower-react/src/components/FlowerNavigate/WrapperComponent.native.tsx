import React, { useMemo } from 'react'

//TODO type FlowerNavigateWrapper props
function FlowerNavigateWrapper({ Component, onNavigate, ...props }: any) {
  const newProps = useMemo(
    () => ({
      ...props,
      onPress: onNavigate
    }),
    [props, onNavigate]
  )

  if (typeof Component === 'function') {
    return Component(newProps)
  }

  return <Component {...newProps} />
}

const component = React.memo(FlowerNavigateWrapper)

export default component
