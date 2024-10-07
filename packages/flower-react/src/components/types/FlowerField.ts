import { FunctionRule, RulesObject } from '@flowerforce/flower-core'

export type FlowerFieldProps<
  T extends Record<string, any> = Record<string, any>
> = {
  /** The path to the value you want to read from the flow's data
   *
   * Example: id="loginForm.name"
   *
   * The FlowerField component reads the value of the key "name" of the loginForm object in the flow's data
   */
  id?: string
  /** The FlowerField's children  */
  children:
    | React.ReactNode
    | ((props: {
        /** The string passed to the "id" FlowerField's prop */
        id: string
        /** The value found at the "id" key in the flow data
         *
         * Example: id="loginForm.name"
         *
         * This parameter will hold the value found at the key 'name' of the loginForm object in the flow's data.
         */
        value: any
        /** An array of strings containing error messages associated with validation rules that are not satisfied. */
        errors: undefined | string[]
        /** This parameter will notify you when there are validation errors. */
        hasError: undefined | boolean
        /** Use this function to write a new value at the "id" key
         *
         * Example: id="loginForm.name"
         *
         * onChange("John") will write "John" at the key 'name' of the loginForm object in the flow's data.
         */
        onChange: (props: any) => void
        /** The function executed on blur input*/
        onBlur: () => void
        /** The function executed on focus input*/
        onFocus: () => void
        /** This value is set to true when the form has been submitted at least once or a next invoked */
        isSubmitted: boolean
        /** This parameter will notify you whether the form field has been focues */
        focused: boolean | undefined
        /** This parameter will notify you whether the form field has been touched */
        touched: boolean
        /** This parameter will notify you if the form field is filled in at least once */
        dirty: boolean
        /** true when some of the display rules are not satisfied, and you have passed true to the "alwaysDisplay" FlowerField's prop*/
        hidden: boolean
        /** true when you have an async validation in progress */
        isValidating: boolean | undefined
      }) => React.ReactNode | React.ReactElement | undefined)

  /**The validation rules for that field
   *
   *  Example: validate={[
   *
   *       {
   *           rules: {
   *             $self: {
   *               $regex:
   *                 '^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$',
   *             },
   *           },
   *           message: 'Value not valid',
   *        },
   *        {
   *          // Don't use promises
   *          rules: (data)=> {
   *            return data.name === 'Andrea'
   *          },
   *          message: 'Value not valid',
   *        }
   *       ]}
   *
   * For every rule you can pass an error message, that Flower returns when that condition is note satisfied
   */
  validate?: Record<string, any>[] | string[]
  /** A function to perform an async validation */
  asyncValidate?: (
    value: any,
    data?: Record<string, any>,
    errors?: undefined | string[]
  ) =>
    | string[]
    | undefined
    | Promise<string[]>
    | { message: string }[]
    | boolean
    | Promise<boolean>
  /** Use this to set a debounce for the async validation
   *
   * The default value is 0
   */
  asyncDebounce?: number
  /** The initial error message when you have an async validation
   *
   * The default value is undefined
   */
  asyncInitialError?: string
  /** The message that the FlowerField returns while validating*/
  asyncWaitingError?: string
  /** An object containing the display rules of that component. When the conditions are not satisfied, the children is hidden.
   *
   * Example: rules={{ $and: [{ name: { $exists: true } }] }}
   */
  rules?: RulesObject<T> | FunctionRule
  /** The name of the flow from which read the data
   *
   * - note: the default value is the name of the flow where the component is used
   */
  flowName?: string
  /** Initial value field */
  defaultValue?: unknown
  destroyValue?: boolean
  value?: any
  /** When set to true, the children is shown even if the rules are not satisfied
   *
   * The FlowerField returns the boolean variable "hidden" to notify you if the conditions are satisfied or not
   */
  alwaysDisplay?: boolean
  /** The function executed when the value found at the path passed to the "id" prop changes */
  onUpdate?: (value: any) => void
  /** The function executed at the "onBlur" event, for example for Input components
   *
   * The onBlur function will test all the validation rules
   */
  onBlur?: (e: any) => void
  /** The function executed at the "onFocus" event, for example for Input components
   *
   * The onFocus function will test all the validation rules
   */
  onFocus?: (e: any) => void
}
