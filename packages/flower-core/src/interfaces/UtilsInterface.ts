export interface CoreStateUtils {
  /**
   * @param state
   *
   * Extracts data from all flows in the state object.
   * It iterates through each flow and retrieves its data property.
   */
  getAllData<T extends object>(
    state: T | undefined
  ): Record<string, any> | undefined
  /**
   *
   * @param name
   * @param id
   *
   * Selects the form node with a specific ID from a given flow.
   * It returns a selector function that accepts the state as an argument and retrieves the form node
   */
  selectFlowerDataNode<T extends object>(
    name: string
  ): (state: T) => Record<string, any>
  /**
   *
   * @param name
   *
   * Creates a selector function that selects the next rules for the current node in a given flow.
   * It retrieves the next rules from the state
   */
  makeSelectCurrentNodeId<T extends object>(name: string): (state: T) => string
  /**
   *
   * @param name
   *
   * Creates a selector function that selects the ID of the current node in a given flow.
   * It first retrieves the sub-state of the specified flow, then checks if there's a current node ID;
   * if not, it falls back to the start ID.
   */
  makeSelectCurrentNextRules<T extends object>(name: string): (state: T) => any
  /**
   *
   * @param name
   * @param currentNodeId
   *
   * Creates a selector function that selects error-related information for a specific node in a given flow.
   * It retrieves the form node using selectFlowerFormNode, then extracts information about touched state, errors, validation status, and validity.
   */
  makeSelectNodeErrors<T extends object>(
    name: string,
    currentNodeId: string
  ): (state: T) => {
    isSubmitted: boolean
    isDirty: boolean
    errors: any
    customErrors: any
    isValid: boolean
    isValidating?: boolean
  }
}
