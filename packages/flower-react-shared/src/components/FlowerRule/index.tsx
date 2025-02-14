import React, { useContext, useEffect } from 'react'
import { MatchRules } from '@flowerforce/flower-core'
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

  const keys = MatchRules.utils.getKeys(rules, { prefix: name })

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
    return React.Children.map(children, (child, i) => {
      if (React.isValidElement(child)) {
        const { props, type } = child
        const Component = type
        // eslint-disable-next-line react/jsx-props-no-spreading
        return Component && <Component key={i} hidden {...props} />
      }
      return child
    })
  }

  return hidden
    ? undefined
    : React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
          const { props, type } = child
          const Component = type
          // eslint-disable-next-line react/jsx-props-no-spreading
          return Component && <Component key={i} {...props} />
        }
        return child
      })
}

const component = React.memo(FlowerRule)
component.displayName = 'FlowerRule'

export const Component = component
