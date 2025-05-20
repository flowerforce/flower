import { Node } from './CoreInterface'
import { Flower } from './Store'

export type ActionWithPayload<T> = {
  type: string
  payload: T
}

type ReducerFunctionSign<T extends object, R> = (
  state: Record<string, Flower<T>>,
  action: ActionWithPayload<R>
) => Record<string, Flower<T>> | void

export type CoreReducersFunctions<
  T extends Record<string, any> = Record<
    FlowCaseReducersNames,
    Flower<Record<string, any>>
  >
> = {
  /**
   * @param state
   * @param action
   *
   * Adds a node to the history of a specific flow if the node exists.
   *
   * @returns state
   */
  historyAdd: ReducerFunctionSign<T, { name: string; node: string }>
  /**
   * @param state
   * @param action
   *
   * Navigates to a specific node in the history of a flow.
   *
   * @returns state
   */
  historyPrevToNode: ReducerFunctionSign<
    T,
    { name: string; node: string } | string
  >
  /**
   * @param state
   * @param action
   *
   * Adds multiple nodes to the history of a flow, starting from a specified index.
   *
   * @returns state
   */
  forceAddHistory: ReducerFunctionSign<
    T,
    { history: string[]; name?: string; flowName?: string }
  >
  /**
   * @param state
   * @param action
   *
   * Removes the current node from the history of a flow.
   *
   * @returns state
   */
  historyPop: ReducerFunctionSign<T, { name: string }>
  /**
   * @param state
   * @param action
   *
   * Restores the history of a flow to its initial state.
   *
   * @returns state
   */
  restoreHistory: ReducerFunctionSign<T, { name: string }>
  /**
   * @param state
   * @param action
   *
   * Replaces the current node in a flow with a specified node.
   *
   * @returns state
   */
  replaceNode: ReducerFunctionSign<
    T,
    { node: string; name?: string; flowName?: string }
  >
  /**
   * @param state
   * @param action
   *
   * Initializes a flow from a specific node.
   *
   * @returns state
   */
  initializeFromNode: ReducerFunctionSign<
    T,
    { node: string; name?: string; flowName?: string }
  >
  /**
   * @param state
   * @param action
   *
   * Resets the history of a flow forcefully.
   *
   * @returns state
   */
  forceResetHistory: ReducerFunctionSign<
    T,
    { name?: string; flowName?: string }
  >
  /**
   * @param state
   * @param action
   *
   * Destroys a flow by removing it from the state.
   *
   * @returns state
   */
  destroy: ReducerFunctionSign<T, { name: string }>
  /**
   * @param state
   * @param action
   *
   * Initializes the nodes of a flow, setting its initial state and generating necessary data structures.
   *
   * @returns state
   */
  initNodes: ReducerFunctionSign<
    T,
    {
      name: string
      startId: string
      persist: boolean
      nodes: Node[]
      initialState: {
        startId?: string
        current?: string
        history?: string[]
      }
      initialData?: Record<string, unknown>
    }
  >
  /**
   * @param state
   * @param action
   *
   * Sets the current node of a flow to a specified node.
   *
   * @returns state
   */
  setCurrentNode: ReducerFunctionSign<T, { name: string; node: string }>
  /**
   * @param state
   * @param action
   *
   * Handles node transitions in a flow, updating history and form states accordingly.
   *
   * @returns state
   */
  node: ReducerFunctionSign<
    T,
    {
      name: string
      flowName?: string
      nodeId?: string
      node?: string
      history: string[]
    }
  >
  /**
   * @param state
   * @param action
   *
   * Navigates to a specific node in the history of a flow.
   *
   * @returns state
   */
  prevToNode: ReducerFunctionSign<
    T,
    { name?: string; flowName?: string; node: string }
  >
  /**
   * @param state
   * @param action
   *
   * Moves to the next node in a flow based on validation rules and current state.
   *
   * @returns state
   */
  next: ReducerFunctionSign<
    T,
    {
      name?: string
      flowName?: string
      route?: string
      data?: Record<string, any>
      dataIn?: Record<string, any>
      isStart?: boolean
    }
  >
  /**
   * @param state
   * @param action
   *
   * Moves to the previous node in a flow.
   *
   * @returns state
   */
  back: ReducerFunctionSign<T, { name?: string; flowName?: string }>
  /**
   * @param state
   * @param action
   *
   * Return back to the first node and resets history.
   *
   * @returns state
   */
  restart: ReducerFunctionSign<T, { name?: string; flowName?: string }>
  /**
   * @param state
   * @param action
   *
   * Returns back to the first node, resets history and clean all previous data from flow.
   *
   * @returns state
   */
  reset: ReducerFunctionSign<
    T,
    { name?: string; flowName?: string }
    /**
     * @param state
     * @param action
     *
     * Reset form.
     *
     * @returns state
     */
  >
}

export type FlowCaseReducersNames =
  | 'historyAdd'
  | 'historyPrevToNode'
  | 'forceAddHistory'
  | 'historyPop'
  | 'restoreHistory'
  | 'replaceNode'
  | 'forceResetHistory'
  | 'destroy'
  | 'initNodes'
  | 'setCurrentNode'
  | 'node'
  | 'prevToNode'
  | 'next'
  | 'back'
  | 'restart'
  | 'reset'

type DataReducerFunctionSign<T extends object, R = object> = (
  state: Record<string, T>,
  action: ActionWithPayload<{ rootName: string } & R>
) => Record<string, T> | void

export type DataReducersFunctions<
  T extends Record<string, any> = Record<
    DataCaseReducersNames,
    Record<string, any>
  >
> = {
  /**
   * @param state
   * @param action
   *
   * Sets the "touched" state of a form node in a flow.
   *
   * @returns state
   */
  setFormSubmitted: DataReducerFunctionSign<T>
  /**
   * @param state
   * @param action
   *
   * Adds errors to a form node in a flow.
   *
   * @returns state
   */
  addCustomDataErrors: DataReducerFunctionSign<
    T,
    {
      id: string
      errors: string[]
    }
  >
  /**
   * @param state
   * @param action
   *
   * Adds errors to a form node in a flow.
   *
   * @returns state
   */
  addDataErrors: DataReducerFunctionSign<
    T,
    {
      id: string
      errors: { [x: string]: string[] } | string[]
    }
  >
  /**
   * @param state
   * @param action
   *
   * Set dirty form single field
   *
   * @returns state
   */
  fieldDirty: DataReducerFunctionSign<
    T,
    {
      id: string
      dirty?: boolean
    }
  >
  /**
   * @param state
   * @param action
   *
   * Set touch form single field
   *
   * @returns state
   */
  fieldTouch: DataReducerFunctionSign<
    T,
    {
      id: string
      touched?: boolean
    }
  >
  /**
   * @param state
   * @param action
   *
   * Set touch form single field
   *
   * @returns state
   */
  fieldFocus: DataReducerFunctionSign<
    T,
    {
      id: string
      focused?: boolean
    }
  >
  /**
   * @param state
   * @param action
   *
   * Removes errors from a form node in a flow.
   *
   * @returns state
   */
  removeDataErrors: DataReducerFunctionSign<
    T,
    {
      id: string
    }
  >
  /**
   * @param state
   * @param action
   *
   * Adds data to a flow.
   *
   * @returns state
   */
  addData: DataReducerFunctionSign<
    T,
    {
      value: T
    }
  >
  /**
   * @param state
   * @param action
   *
   * Adds data to a flow at a specific path.
   *
   * @returns state
   */
  addDataByPath: DataReducerFunctionSign<
    T,
    {
      id: string
      value: T | string
      dirty?: boolean
    }
  >
  /**
   * @param state
   * @param action
   *
   * Replaces the data of a flow with new data.
   *
   * @returns state
   */
  replaceData: DataReducerFunctionSign<
    T,
    {
      value: T
    }
  >
  /**
   * @param state
   * @param action
   *
   * Unsets data from a flow at a specific path.
   *
   * @returns state
   */
  unsetData: DataReducerFunctionSign<
    T,
    {
      id: string[] | string
    }
  >
  /**
   * @param state
   * @param action
   *
   * Sets the "isValidating" state of a form node in a flow.
   *
   * @returns state
   */
  setIsDataValidating: DataReducerFunctionSign<T, { isValidating?: boolean }>
  /**
   * @param state
   * @param action
   *
   * Reset form.
   *
   * @returns state
   */
  resetData: DataReducerFunctionSign<
    T,
    { rootName: string; initialData?: Record<string, any> }
  >
  /**
   * @param state
   * @param action
   *
   * Reset form.
   *
   * @returns state
   */
  initData: DataReducerFunctionSign<
    T,
    { rootName: string; initialData: Record<string, any> }
  >
}

export type DataCaseReducersNames =
  | 'setFormSubmitted'
  | 'addCustomDataErrors'
  | 'addDataErrors'
  | 'fieldDirty'
  | 'fieldTouch'
  | 'fieldFocus'
  | 'removeDataErrors'
  | 'addData'
  | 'addDataByPath'
  | 'replaceData'
  | 'unsetData'
  | 'setIsDataValidating'
  | 'resetData'
  | 'initData'
