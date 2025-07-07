import React, { Children, memo, useMemo, useRef, useState } from 'react'
import _keyBy from 'lodash/keyBy'
import { devtoolState } from '@flowerforce/flower-core'
import { FlowerReactProvider } from '@flowerforce/flower-react-context'
import _get from 'lodash/get'
import { generateNodesForFlowerJson } from '../utils'

import {
  useClientInitEvent,
  useDestroyFlow,
  useFlowerNavigateEvent,
  useInitDevtools,
  useInitNodes,
  useSelectorsClient,
  useSetCurrentEvent,
  useSetHistoryEvent
} from './hooks'
import { FlowerClientProps } from '../types/Flower'


/*
 * FlowerClient
 */
const FlowerClient = ({
  children,
  name,
  destroyOnUnmount = true,
  persist = false,
  startId = null,
  initialState = {},
  initialData
}: FlowerClientProps) => {
  const flowName = name

  const _persist = persist || !destroyOnUnmount

  const one = useRef(false)
  const [wsDevtools, setWsDevtools] = useState<boolean>(
    devtoolState && _get(devtoolState, '__FLOWER_DEVTOOLS_INITIALIZED__', false)
  )

  const nodes = useMemo(
    () => generateNodesForFlowerJson(Children.toArray(children)),
    [children]
  )
  const nodeById = useMemo(
    () => _keyBy(Children.toArray(children), 'props.id'),
    [children]
  )

  const { current, isDisabled, isInitialized, prevFlowerNodeId } =
    useSelectorsClient(flowName)

  useInitNodes({
    name,
    nodes,
    one,
    initialData,
    initialState,
    persist: _persist,
    startId
  })

  useDestroyFlow({ flowName, one, persist: _persist })

  useInitDevtools({ devtoolState, setWsDevtools, flowName })

  useClientInitEvent({ flowName, isInitialized, wsDevtools })

  useSetHistoryEvent({ flowName, isInitialized, wsDevtools })

  useSetCurrentEvent({ current, flowName, isInitialized, wsDevtools })

  useFlowerNavigateEvent({
    current,
    flowName,
    isDisabled,
    isInitialized,
    wsDevtools
  })

  const currentNodeId = prevFlowerNodeId || current

  const contextValues = useMemo(
    () => ({
      name: flowName,
      currentNode: current
    }),
    [flowName, current]
  )

  const prevContextValues = useMemo(
    () => ({
      name: flowName,
      currentNode: currentNodeId
    }),
    [flowName, currentNodeId]
  )

  return isInitialized ? (
    <>
      <FlowerReactProvider value={prevContextValues}>
        {nodeById[currentNodeId]}
      </FlowerReactProvider>
      <FlowerReactProvider value={contextValues}>
        {!isDisabled && current !== currentNodeId && nodeById[current]}
      </FlowerReactProvider>
    </>
  ) : null
}
const component = memo(FlowerClient)
component.displayName = 'Flower'

// workaround for let typescript read JSX component as a valid JSX element using react 19(?)
export const Flower = component as typeof FlowerClient
