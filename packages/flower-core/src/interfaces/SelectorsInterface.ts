import { RulesObject } from './CoreInterface'
import { Flower, Form, INode } from './Store'

export interface ISelectors {
  /**
   * @param state
   * @returns
   */
  selectGlobal<T extends Record<string, any>>(state: {
    flower: { [x: string]: Flower<T> }
  }): { [x: string]: Flower<T> }
  /**
   * @param name
   * @returns
   */
  selectFlower<T extends Record<string, any>>(
    name: string
  ): (state: { [x: string]: Flower<T> }) => Flower<T>
  /**
   * @param id
   * @returns
   */
  selectFlowerFormNode<T extends Record<string, any>>(
    id: string
  ): (state: Flower<T>) => Form<T>
  /**
   * @param flower
   * @returns
   */
  selectFlowerHistory<T extends Record<string, any>>(
    flower: Flower<T>
  ): Array<string>
  /**
   * @param flower
   * @returns
   */
  makeSelectNodesIds<T extends Record<string, any>>(
    flower: Flower<T>
  ): Flower<T>['nodes']
  /**
   * @param flower
   * @returns
   */
  makeSelectStartNodeId<T extends Record<string, any>>(
    flower: Flower<T>
  ): string
  /**
   * @param flower
   * @param startNodeId
   * @returns
   */
  makeSelectCurrentNodeId<T extends Record<string, any>>(
    flower: Flower<T>,
    startNodeId: Flower<T>['startId']
  ): string
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
  ): boolean | string | undefined
  /**
   * @param nodes
   * @param current
   * @returns
   */
  makeSelectCurrentNodeDisabled<T extends Record<string, any>>(
    nodes: { [x: string]: Partial<INode> },
    current: Flower<T>['current']
  ): boolean
  /**
   * @param form
   * @returns
   */
  makeSelectNodeErrors<T extends Record<string, any>>(
    form: Form<T> | undefined
  ): {
    touched: boolean
    errors: any
    customErrors: any
    isValid: boolean
    isValidating?: boolean
  }
  /**
   * @param form
   * @returns
   */
  makeSelectNodeFormFieldTouched<T extends Record<string, any>>(
    id: string
  ): (form: Form<T> | undefined) => boolean | undefined
  /**
   * @param flower
   * @returns
   */
  getDataByFlow<T extends Record<string, any>>(flower: Flower<T>): T
  /**
   * @param id
   * @returns
   */
  getDataFromState<T extends Record<string, any>>(
    id: string | string[]
  ): (data: T) => Partial<T>
  /**
   * @param form
   * @returns
   */
  makeSelectNodeFormTouched<T extends Record<string, any>>(
    form: Form<T>
  ): boolean | undefined
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
  ): (data: T | undefined, form: Form<T>) => Array<string>
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
  ): (data: T | undefined, form: Form<T>) => boolean
}
