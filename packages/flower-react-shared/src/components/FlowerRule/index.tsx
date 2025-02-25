import React, { Fragment, useContext, useEffect } from 'react'
import { rulesMatcherUtils } from '@flowerforce/flower-core'
import { useSelector } from '@flowerforce/flower-react-store'
import { selectorRulesDisabled } from './selectors'
import { FlowerReactContext } from '@flowerforce/flower-react-context'
import type { FlowerRuleProps } from '../types/FlowerRule'

const FlowerRule = ({
  children,
  rules,
  value,
  alwaysDisplay,
  formName,
  id,
  onUpdate
}: FlowerRuleProps) => {
  const { name: flowNameContext } = useContext(FlowerReactContext)

  const name = formName || flowNameContext

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
      return children({ hidden })
    }
    if (hidden) {
      return undefined
    }
    return children({})
  }

  if (alwaysDisplay && hidden) {
    return (
      <Fragment>
        {React.Children.map(children, (child, i) => {
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

  return hidden ? undefined : (
    <Fragment>
      {React.Children.map(children, (child, i) => {
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

const component = React.memo(FlowerRule)
component.displayName = 'FlowerRule'

export const Component = component as typeof FlowerRule
