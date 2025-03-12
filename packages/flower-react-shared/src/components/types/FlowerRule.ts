import React from 'react'
import { FunctionRule, RulesObject } from '@flowerforce/flower-core'

export type FlowerRuleProps = {
  /** The path to the value you want to read from the flow's data
   *
   * Example: id="loginForm.name"
   *
   * The FlowerRule component reads the value of the key "name" of the loginForm object in the flow's data
   */
  id?: string
  /** */
  value?: any
  /** An object or function containing the display rules of that component. When the conditions are not satisfied, the children is hidden.
   *
   * Example: rules={{ $and: [{ name: { $exists: true } }] }}
   * Example: rules={(state) => state... === true}
   * if missing it is always visible
   */
  rules?: RulesObject<Record<string, any>> | FunctionRule
  /** The name of the flow from which read the data
   *
   * - note: the default value is the name of the flow where the component is used
   */
  rootName?: string
  /** When set to true, the children is shown even if the rules are not satisfied
   *
   * The FlowerRule returns the boolean variable "hidden" to notify you if the conditions are satisfied or not
   */
  alwaysDisplay?: boolean
  /** The function executed when the value found at the path passed to the "id" prop changes */
  onUpdate?: (hidden: boolean) => void
  /** The children of the FlowerRule*/
  children?:
    | React.ReactNode
    | ((props: {
        hidden?: boolean
      }) => React.ReactNode | React.ReactElement | undefined)
}
