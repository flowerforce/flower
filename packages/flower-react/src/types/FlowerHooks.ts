import {
  Route,
  RouteNode,
  RoutePrev,
  RouteReset,
  RouteRestart
} from './FlowerNavigate'

export type UseFlowerProps = { [x in 'name' | 'flowName']?: string }

export type useFlowerActions = {
  /** Use this function to move to the next node inside the flow*/
  next: (payload?: Route) => void
  /**Use this function to move to the previous node inside the flow*/
  back: (payload?: RoutePrev) => void
  /**Use this function to return to the first node and restore history */
  reset: (payload?: RouteReset) => void
  /**Use this function to move to a specific node*/
  jump: (payload: RouteNode) => void
  /**Use this function to reset the flow data and history */
  restart: (payload?: RouteRestart) => void
  /**Get current node by flowName or current flow */
  getCurrentNodeId: (flowName?: string) => string
}

export type UseFlower = (options?: UseFlowerProps) => useFlowerActions & {
  /**The flow in which the hook is used.*/
  flowName?: string
  /**Current node id*/
  nodeId: string
  /**Initial start node id*/
  startId: string
}

export type NavigateFunctionParams = string | Record<string, any>
