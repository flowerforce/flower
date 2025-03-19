/* eslint-disable */
import React, { Fragment, useContext, useEffect, useMemo } from 'react'
import { CoreUtils } from '@flowerforce/flower-core'
import { DataSelectors, ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { FlowerRule } from '../FlowerRule'
import type { FlowerValueProps } from '../types'
import { FlowerReactContext } from '@flowerforce/flower-react-context'

//TODO make types for wrapper function
function Wrapper({
  Component,
  id,
  rootName,
  spreadValue,
  hidden,
  onUpdate,
  ...props
}: any) {
  const { rootName: formNameFromPath, path } = useMemo(
    () => CoreUtils.getPath(id),
    [id]
  )
  const { useSelector } = ReduxFlowerProvider.getReduxHooks()
  const value = useSelector(
    DataSelectors.getDataFromState(formNameFromPath ?? rootName, path)
  )
  const values =
    spreadValue && typeof value === 'object' && !Array.isArray(value)
      ? value
      : { value }

  useEffect(() => {
    if (onUpdate) {
      onUpdate(value)
    }
  }, [onUpdate, value])

  return (
    <Component
      id={id}
      {...props}
      rootName={rootName}
      hidden={hidden}
      {...values}
    />
  )
}

const RenderRules = ({
  id,
  alwaysDisplay,
  rules,
  value,
  Component,
  spreadValue,
  rootName,
  flowName,
  onUpdate,
  ...props
}: any) => {
  return (
    <FlowerRule
      alwaysDisplay={alwaysDisplay}
      rules={rules}
      value={value}
      rootName={rootName || flowName}
      id={id}
    >
      {({ hidden }) => (
        <Wrapper
          {...props}
          hidden={hidden}
          id={id}
          Component={Component}
          spreadValue={spreadValue}
          rootName={rootName || flowName}
          onUpdate={onUpdate}
        />
      )}
    </FlowerRule>
  )
}

const _FlowerValue = ({
  id = '*',
  rules,
  alwaysDisplay,
  value,
  children,
  spreadValue,
  rootName,
  onUpdate
}: FlowerValueProps) => {
  const { name: formNameCtx, initialData } = useContext(FlowerReactContext)

  const name = rootName || formNameCtx
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
    )
  }

  return (
    <Fragment>
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child
        const { type, props } = child
        const Component = type
        // eslint-disable-next-line react/jsx-props-no-spreading
        return (
          <RenderRules
            key={i}
            id={id}
            alwaysDisplay={alwaysDisplay}
            rules={rules}
            value={value}
            spreadValue={spreadValue}
            rootName={name}
            Component={Component}
            {...props}
            onUpdate={onUpdate}
          />
        )
      })}
    </Fragment>
  )
}

const component = React.memo(_FlowerValue)
component.displayName = 'FlowerValue'

export const FlowerValue = component as typeof _FlowerValue
