import { PropsWithChildren } from "react"

export type FlowerInitalState = {
  startId?: string
  current?: string
  history?: string[]
}

export type FlowerClientProps = PropsWithChildren & {
  name: string
  /**@deprecated Use persist instead */
  destroyOnUnmount?: boolean
  persist?: boolean
  startId?: string | null
  initialData?: any
  initialState?: FlowerInitalState
}
