import { RulesObject } from './CoreInterface';
import { Flower, Form } from './Store';

export interface ISelectors {
  /**
   * @param state
   * @returns
   */
  selectGlobal<T extends Record<string, any>>(state: { flower: T }): Partial<T>;
  /**
   * @param name
   * @returns
   */
  selectFlower<T extends Record<string, any>>(
    name: string
  ): (state: Flower<T>) => Partial<Flower<T>>;
  /**
   * @param id
   * @returns
   */
  selectFlowerFormNode<T extends Record<string, any>>(
    id: string
  ): (state: Flower<T>) => Form<T>;
  /**
   * @param flower
   * @returns
   */
  selectFlowerHistory<T extends Record<string, any>>(
    flower: Flower<T>
  ): Array<string>;
  /**
   * @param flower
   * @returns
   */
  makeSelectNodesIds<T extends Record<string, any>>(
    flower: Flower<T>
  ): Partial<Flower<T>['nodes']>;
  /**
   * @param flower
   * @returns
   */
  makeSelectStartNodeId<T extends Record<string, any>>(
    flower: Flower<T>
  ): string;
  /**
   * @param flower
   * @param startNodeId
   * @returns
   */
  makeSelectCurrentNodeId<T extends Record<string, any>>(
    flower: Flower<T>,
    startNodeId: Flower<T>['startId']
  ): string;
  /**
   * @param nodes
   * @param history
   * @param current
   * @returns
   */
  makeSelectPrevNodeRetain<T extends Record<string, any>>(
    nodes: Flower<T>['nodes'],
    history: Flower<T>['history'],
    current: Flower<T>['current']
  ): boolean | string | undefined;
  /**
   * @param nodes
   * @param current
   * @returns
   */
  makeSelectCurrentNodeDisabled<T extends Record<string, any>>(
    nodes: { [x: string]: { disabled: boolean } },
    current: Flower<T>['current']
  ): boolean;
  /**
   * @param form
   * @returns
   */
  makeSelectNodeErrors<T extends Record<string, any>>(
    form: Form<T> | undefined
  ): {
    touched: boolean;
    errors: any;
    isValid: boolean;
    isValidating?: boolean;
  };
  /**
   * @param flower
   * @returns
   */
  getDataByFlow<T extends Record<string, any>>(
    flower: Flower<T>
  ): Record<string, any>;
  /**
   * @param id
   * @returns
   */
  getDataFromState<T extends Record<string, any>>(
    id: string | string[]
  ): (data: Flower<T>) => Flower<T>['data'];
  /**
   * @param form
   * @returns
   */
  makeSelectNodeFormTouched<T extends Record<string, any>>(
    form: Form<T>
  ): boolean | undefined;
  /**
   * @param name
   * @param id
   * @param validate
   * @returns
   */
  makeSelectFieldError<T extends Record<string, any>>(
    name: string,
    id: string,
    validate: { rules?: RulesObject<any>; message?: string }[] | null
  ): (data: Flower<T>) => Array<string>;
  /**
   * @param id
   * @param rules
   * @param keys
   * @param flowName
   * @param value
   * @returns
   */
  selectorRulesDisabled<T extends Record<string, any>>(
    id: string,
    rules: any,
    keys: string[] | null,
    flowName: string,
    value: any
  ): (
    data: Flower<T>,
    form: {
      touched: boolean;
      errors: any;
      isValid: boolean;
      isValidating?: boolean;
    }
  ) => boolean;
}
