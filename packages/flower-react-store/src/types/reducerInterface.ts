import { ActionWithPayload } from '@flowerforce/flower-core'

type DataReducerFunctionSign<T extends object, R = object> = (
  state: Record<string, T>,
  action: ActionWithPayload<{ rootName: string } & R>
) => Record<string, T> | void
// from `flowName` to `formName`
// from `currentNode` to `formNode`? Or it's better to handle it directly under `flowName`?
export type DataReducersFunctions<
  T extends Record<string, any> = Record<string, Record<string, any>>
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
  formAddCustomErrors: DataReducerFunctionSign<
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
  formAddErrors: DataReducerFunctionSign<
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
  formFieldDirty: DataReducerFunctionSign<
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
  formFieldTouch: DataReducerFunctionSign<
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
  formFieldFocus: DataReducerFunctionSign<
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
  formRemoveErrors: DataReducerFunctionSign<
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
  setFormIsValidating: DataReducerFunctionSign<T, { isValidating?: boolean }>
  /**
   * @param state
   * @param action
   *
   * Reset form.
   *
   * @returns state
   */
  resetForm: DataReducerFunctionSign<
    T,
    { formName: string; initialData?: Record<string, any> }
  >
  /**
   * @param state
   * @param action
   *
   * Reset form.
   *
   * @returns state
   */
  initForm: DataReducerFunctionSign<
    T,
    { formName: string; initialData: Record<string, any> }
  >
}
