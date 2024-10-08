import { RulesObject } from '@flowerforce/flower-core'

export type Route = string | Record<string, any>

export type RouteNode =
  //** The target node id */
  | string
  | {
      //** The target node id */
      node: string
      //** The name of the flow in which call the function.*/
      flowName?: string
      /**
       * The flow's history on server component
       * @experimental
       */
      history?: string[]
    }

export type RouteRestart =
  //** The target node id */
  | string
  | {
      //** The target node id */
      node: string
      //** The name of the flow in which call the function.*/
      flowName?: string
    }

export type RouteReset =
  //** The target node id */
  | string
  | {
      //** The target node id */
      node: string
      //** The name of the flow in which call the function.*/
      flowName?: string
      //** The initial flow data to restore */
      initialData?: Record<string, any>
    }

export type RoutePrev =
  //** The target node id */
  | string
  | {
      //** The target node id */
      node: string
      //** The name of the flow in which call the function.*/
      flowName?: string
    }

export type FlowerNavigateActionsProps =
  | {
      action: 'next'
      node?: never
      route?: Route
    }
  | {
      action: 'back'
      node?: RoutePrev
      route?: never
    }
  | {
      action: 'reset'
      node?: RouteReset
      route?: never
    }
  | {
      action: 'jump'
      node?: RouteNode
      route?: never
    }
  | {
      action: 'restart'
      node?: RouteRestart
      route?: never
    }

export type FlowerNavigateProps = {
  /** The name of the flow from which read the data
   *
   * - note: the default value is the name of the flow where the component is used
   */
  flowName?: string | undefined

  /** The FlowerNavigate's children  */
  children:
    | React.ReactNode
    | ((
        props: Record<string, any>
      ) => React.ReactNode | React.ReactElement | undefined)
  /** An object containing the display rules of that component. When the conditions are not satisfied, the children is hidden. */
  rules?: RulesObject<Record<string, any>> | Record<string, RulesObject<any>>
  /** When set to true, the children is shown even if the rules are not satisfied
   *
   * The FlowerValue returns the boolean variable "hidden" to notify you if the conditions are satisfied or not
   */
  alwaysDisplay?: boolean
} & FlowerNavigateActionsProps
