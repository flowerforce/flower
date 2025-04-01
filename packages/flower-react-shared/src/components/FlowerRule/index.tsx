import React, { Fragment, useContext, useEffect } from 'react'
import type { FlowerRuleProps } from '../types/FlowerRule'
import { selectorRulesDisabled } from '../../features'
import { rulesMatcherUtils } from '@flowerforce/flower-core'
import { ReduxFlowerProvider } from '@flowerforce/flower-react-store'
import { FlowerReactContext } from '@flowerforce/flower-react-context'

const _FlowerRule = ({
  children,
  rules,
  value,
  alwaysDisplay,
  rootName,
  id,
  onUpdate
}: FlowerRuleProps) => {
  const { name: flowNameContext } = useContext(FlowerReactContext)

  const { useSelector } = ReduxFlowerProvider.getReduxHooks()
  const name = rootName || flowNameContext

  const keys = rulesMatcherUtils.getKeys(rules, { prefix: name })

  const hidden = useSelector(
    selectorRulesDisabled(id ?? '', rules, keys ?? [], name ?? '', value)
  )

  useEffect(() => {
    if (onUpdate) {
      onUpdate(hidden)
    }
  }, [hidden, onUpdate])

  if (typeof children === 'function') {
    if (alwaysDisplay && hidden) {
      return children({ hidden }) ? (
        <Fragment>{children({ hidden })}</Fragment>
      ) : null
    }
    if (hidden) {
      return null
    }
    return children({}) ? <Fragment>{children({})}</Fragment> : null
  }

  if (alwaysDisplay && hidden) {
    return (
      <Fragment>
        {React.Children.map(children, (child, i) => {
          if (typeof child === 'undefined') return null
          if (React.isValidElement(child)) {
            const { props, type } = child
            const Component = type
            // eslint-disable-next-line react/jsx-props-no-spreading
            return Component && <Component key={i} hidden {...props} />
          }
          return child
        })}
      </Fragment>
    )
  }

  if (hidden) return null

  return (
    <Fragment>
      {React.Children.map(children, (child, i) => {
        if (typeof child === 'undefined') return null
        if (React.isValidElement(child)) {
          const { props, type } = child
          const Component = type
          // eslint-disable-next-line react/jsx-props-no-spreading
          return Component && <Component key={i} {...props} />
        }
        return child
      })}
    </Fragment>
  )
}

const component = React.memo(_FlowerRule)
component.displayName = 'FlowerRule'

export const FlowerRule = component as typeof _FlowerRule
