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

export type ActionsTypes =
  | 'historyAdd'
  | 'historyPrevToNode'
  | 'setFormTouched'
  | 'forceAddHistory'
  | 'historyPop'
  | 'restoreHistory'
  | 'replaceNode'
  | 'initializeFromNode'
  | 'forceResetHistory'
  | 'destroy'
  | 'initNodes'
  | 'setCurrentNode'
  | 'formAddErrors'
  | 'formRemoveErrors'
  | 'addData'
  | 'addDataByPath'
  | 'replaceData'
  | 'unsetData'
  | 'setFormIsValidating'
  | 'resetForm'
  | 'formFieldTouch'
  | 'node'
  | 'prevToNode'
  | 'next'
  | 'prev'
  | 'reset'

// TODO WATCH OVER FLOWER REDUCER STATE AND CREATE SOME MORE SPECIFIC TYPES
/**
 * These functions are Redux reducers used in a Flux architecture for managing state transitions and updates in a Flower application.
 */

// type SliceCaseReducers<State> = {
//   [K: string]: CaseReducer<State, {
//       payload: any;
//       type: string;
//   }> | CaseReducerWithPrepare<State, PayloadAction<any, string, any, any>>;
// }

export type ReducersFunctions<
  T extends Record<string, any> = Record<string, Flower<Record<string, any>>>
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
   * Sets the "touched" state of a form node in a flow.
   *
   * @returns state
   */
  setFormTouched: ReducerFunctionSign<
    T,
    { flowName: string; currentNode: string } | string
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
      initialData: any
      initialState: {
        startId?: string
        current?: string
        history?: string[]
      }
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
   * Adds errors to a form node in a flow.
   *
   * @returns state
   */
  formAddCustomErrors: ReducerFunctionSign<
    T,
    {
      name: string
      currentNode: string
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
  formAddErrors: ReducerFunctionSign<
    T,
    {
      name: string
      currentNode: string
      id: string
      errors: { [x: string]: string[] } | string[]
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
  formFieldTouch: ReducerFunctionSign<
    T,
    {
      name: string
      currentNode: string
      id: string
      touched?: boolean
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
  formRemoveErrors: ReducerFunctionSign<
    T,
    {
      name: string
      currentNode: string
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
  addData: ReducerFunctionSign<
    T,
    {
      flowName: string
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
  addDataByPath: ReducerFunctionSign<
    T,
    {
      id: string
      flowName: string
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
  replaceData: ReducerFunctionSign<
    T,
    {
      flowName: string
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
  unsetData: ReducerFunctionSign<
    T,
    {
      id: string[] | string
      flowName: string
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
  setFormIsValidating: ReducerFunctionSign<
    T,
    { name: string; currentNode: string; isValidating?: boolean }
  >
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
    { name?: string; flowName?: string; data: T; route?: string }
  >
  /**
   * @param state
   * @param action
   *
   * Moves to the previous node in a flow.
   *
   * @returns state
   */
  prev: ReducerFunctionSign<T, { name?: string; flowName?: string }>
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
    { name?: string; flowName?: string; initialData?: Record<string, any> }
    /**
     * @param state
     * @param action
     *
     * Reset form.
     *
     * @returns state
     */
  >
  resetForm: ReducerFunctionSign<T, { id: string; flowName: string }>
}
