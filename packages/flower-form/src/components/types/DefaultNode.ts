export type FlowerNodeDefaultProps = {
  /** Unique identifier for the node inside the Flow */
  id: string
  /** An object containing the informations about the node's links.
   *
   * Example: to={{ step2: { rules: { $and: [{ name: { $eq: 'John' } }] } } }}
   *
   * In that case, the FlowerNode is linked to the node with the ID 'step2'
   *
   * You can move from the current node to the step2 node only if the rules are satisfied
   *
   * Set it to null when you don't have rules
   *
   * Example: to={{ step2: null}
   */
  to?: Record<string, any>
  /** The children of the FlowerNode */
  children?: React.ReactNode
  /** The function executed when you enter into this FlowerNode */
  onEnter?: () => void
  /** The function executed when you leave this FlowerNode */
  onExit?: () => void
  /** When set to true, the FlowerNode is ignored and skipped */
  disabled?: boolean
}
