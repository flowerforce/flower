import React, { useEffect } from 'react'
import { FlowerFlowProps } from './types/FlowerFlow'

const FlowerFlow = ({ children, onEnter, onExit }: FlowerFlowProps) => {
  useEffect(() => {
    onEnter?.()
    return () => {
      onExit?.()
    }
  }, [onEnter, onExit])
  return <>{children}</>
}

const component = React.memo(FlowerFlow)
component.displayName = 'FlowerFlow'

export default component
// export default component as typeof FlowerFlow
