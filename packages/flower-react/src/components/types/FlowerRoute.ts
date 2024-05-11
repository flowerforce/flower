export type FlowerRouteProps = {
  /** Unique identifier for the node inside the Flow */
  id: string;
  /** TODO document what this props does */
  autostart?: boolean
  /** An object containing the informations about the node's links.
   *
   * Example: to={{ step2: { rules: { $and: [{ name: { $eq: 'John' } }] } } }}
   *
   * In that case, the FlowerRoute is linked to the node with the ID 'step2'
   *
   * You can move from the current node to the step2 node only if the rules are satisfied
   *
   * Set it to null when you don't have rules
   *
   * Example: to={{ step2: null}
   */
  to?: Record<string, any>;
  /** The children of the FlowerRoute */
  children?: React.ReactNode;
  /** The function executed when you enter into this FlowerRoute */
  onEnter?: () => void;
  /** The function executed when you leave this FlowerRoute */
  onExit?: () => void;
};
