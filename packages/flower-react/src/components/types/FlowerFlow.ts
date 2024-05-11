import { FlowerNodeDefaultProps } from "./DefaultNode";

export type FlowerFlowProps = FlowerNodeDefaultProps & {
  /** A Flower node is visible only when is the current node in the navigation history of the flow.
   *
   * By setting this prop to true, you have the ability to view this node even when it is not the current node.
   *
   * This can only be set to true for FlowerNode and FlowerFlow components.
   *
   * An example use case is when transitioning from a FlowerNode containing a particular screen to an action node.
   *
   * The node with retain set to true will continue to be displayed until a new FlowerNode or FlowerFlow is added to the history
   * */
  retain?: boolean;
};
