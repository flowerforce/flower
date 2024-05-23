import React, { useMemo } from 'react'

function isIntrinsicElement(x: unknown): x is keyof JSX.IntrinsicElements {
  return typeof x === 'string'
}

//TODO type FlowerNavigateWrapper props
function FlowerNavigateWrapper({
  hidden,
  Component,
  onNavigate,
  ...props
}: any) {
  const newProps = useMemo(
    () => ({
      ...props,
      hidden,
      onClick: onNavigate
    }),
    [props, onNavigate]
  )

  if (typeof Component === 'function') {
    return Component(newProps)
  }

  // TODO si arriva in questa condizione quando si passa un componente primitivo es. div
  // in questo caso non posso props custom di flower
  if (isIntrinsicElement(Component))
    return <Component {...props} onClick={onNavigate} />

  /* c8 ignore start */
  // TODO in questa condizione si arriva se nel progetto si utilizza Vite, in questo caso i componenti non sono Function ma Object,
  // oppure nel caso di un testo semplice come children di questo componente

  return Component && <Component {...newProps} />
  /* c8 ignore stop */
}

const component = React.memo(FlowerNavigateWrapper)

export default component
