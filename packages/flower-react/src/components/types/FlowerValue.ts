import { FunctionRule, RulesObject } from '@flowerforce/flower-core'

export type FlowerValueProps = {
  /** The path to the value you want to read from the flow's data
   *
   * Example: id="loginForm.name"
   *
   * The FlowerValue component reads the value of the key "name" of the loginForm object in the flow's data
   * If missing, I return all values, which is equivalent to setting id='*'
   */
  id?: string
  value?: any
  /** An object containing the display rules of that component. When the conditions are not satisfied, the children is hidden.
   *
   * Example: rules={{ $and: [{ name: { $exist: true } }] }}
   */
  rules?: RulesObject | FunctionRule
  /** The FlowerValue's children  */
  children:
    | React.ReactNode
    | ((
        props: Record<string, any>
      ) => React.ReactNode | React.ReactElement | undefined)
  /** Set this value to true to spread the value into separate values in case it is an object. */
  spreadValue?: boolean
  /** The name of the flow from which read the data
   *
   * - note: the default value is the name of the flow where the component is used
   */
  flowName?: string
  /** When set to true, the children is shown even if the rules are not satisfied
   *
   * The FlowerValue returns the boolean variable "hidden" to notify you if the conditions are satisfied or not
   */
  alwaysDisplay?: boolean
  /** The function executed when the value found at the path passed to the "id" prop changes */
  onUpdate?: (value: any) => void
}
