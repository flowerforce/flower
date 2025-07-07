import { NodeConfig } from '@flowerforce/flower-core'
import { FlowerClientProps } from '../../../types/Flower'
import { MutableRefObject } from 'react'


export type UseClientInitEventProps = {
  isInitialized: string
  wsDevtools: boolean
  flowName: string
}

export type UseSetHistoryEventProps = UseClientInitEventProps

export type UseSetCurrentEventProps = UseClientInitEventProps & {
  current: string
}

export type UseFlowerNavigateEventProps = UseSetCurrentEventProps & {
  isDisabled: boolean
}

export type UseDestroyFlowProps = {
  one: MutableRefObject<boolean>
  persist: boolean
  flowName: string
}

export type UseInitDevtoolsProps = {
  devtoolState: Object
  flowName: string
  setWsDevtools: (value: boolean) => void
}

export type UseInitNodesProps = {
    one: MutableRefObject<boolean>
    nodes: NodeConfig[]
  } & Omit<FlowerClientProps, 'destroyOnUnmount'>
