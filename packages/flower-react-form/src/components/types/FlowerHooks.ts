export type UseFlowerProps = { [x in 'name' | 'flowName']?: string }

export type UseFlowerForm = (customFormName?: string) => {
  /**  This value is set to true when the form has been submitted at least once or a next invoked. */
  isSubmitted: boolean
  /**  This value is set to true when at least once field is dirted. */
  isDirty: boolean
  /**  This value is the id of the focused element. */
  hasFocus: string | undefined
  /** An object containing all the form errors */
  errors: Record<string, any>
  /** An object containing all the form custom errors */
  customErrors: Record<string, any>
  /** This value is set to true when all the validation rules are satisfied and the form is valid*/
  isValid: boolean
  /** This value is set to true during asynchronous validation.*/
  isValidating: boolean | undefined
  /** Use this function to read status from the flow's form. */
  getFormStatus: (path?: string) => any
  /** Use this function to read values from the flow's data. */
  getData: (path?: string) => any
  /** Use this function to set values in the flow's data. */
  setData: (
    /** The value that you want to set */
    value: any,
    /** Specify the target path to set the value*/
    id?: string
  ) => void
  /** Use this function to set value in the flow's field data. */
  setDataField: (
    /** Specify the target path to set the value*/
    id: string,
    /** The value that you want to set */
    value: any,
    /** Specify default value for dirty status*/
    dirty?: boolean
  ) => void
  /** Use this function to unset values in the flow's data. */
  unsetData: (
    /** Specify the target path to the value tha you want to unset*/
    path: string
  ) => void
  /** Use this function to replace a value in the flow's data. */
  replaceData: (value: any) => void
  /**
   * Reset form to its initial state if useFlowerForm its inside FlowerForm context, otherwise, it resets all form fields to undefined.
   * Use this function to reset errors form and touched state
   */
  reset: (nodeId?: string) => void
  /**this function to set a custom error on a specific field */
  setCustomErrors: (field: string, errors: string[], nodeId?: string) => void
}
