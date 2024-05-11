import { FlowerNodeProps } from "./FlowerNode";

export type FlowerServerProps = {
  action?: {
      /** The type of the action */
      type: string,
      /** The parameters passed to the action */
      props?: Record<string, any>
  };
} & FlowerNodeProps