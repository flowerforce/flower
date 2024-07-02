import {
  Route,
  RouteNode,
  RoutePrev,
  RouteReset,
  RouteRestart
} from './FlowerNavigate'

export type UseFlowerProps = { [x in 'name' | 'flowName']?: string }

export type UseFlowerForm = (options?: UseFlowerProps) => {
  /**  This value is set to true when the form has been touched at least once. */
  touched: boolean
  /** An object containing all the form errors */
  errors: Record<string, any>
  /** This value is set to true when all the validation rules are satisfied and the form is valid*/
  isValid: boolean
  /** This value is set to true during asynchronous validation.*/
  isValidating: boolean | undefined
  /** Use this function to read values from the flow's data. */
  getData: (path?: string) => any
  /** Use this function to set values in the flow's data. */
  setData: (
    /** The value that you want to set */
    value: any,
    /** Specify the target path to set the value*/
    path?: string
  ) => void
  /** Use this function to unset values in the flow's data. */
  unsetData: (
    /** Specify the target path to the value tha you want to unset*/
    path: string
  ) => void
  /** Use this function to replace a value in the flow's data. */
  replaceData: (value: any) => void
}

type useFlowerActions = {
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
