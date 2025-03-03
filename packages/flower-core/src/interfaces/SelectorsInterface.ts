import { REDUCER_NAME } from '../constants'
import { RulesObject } from './CoreInterface'
import { Flower, Data, INode } from './Store'

export interface IFlowerSelectors {
  /**
   * @param state
   * @returns
   */
  selectGlobal<T extends Record<string, any>>(state: {
    [REDUCER_NAME.FLOWER_FLOW]: { [x: string]: Flower<T> }
  }): { [x: string]: Flower<T> }
  /**
   * @param name
   * @returns
   */
  selectFlower<T extends Record<string, any>>(
    name: string
  ): (state: { [x: string]: Flower<T> }) => Flower<T>
  // /**
  //  * @param id
  //  * @returns
  //  */
  // selectFlowerDataNode<T extends Record<string, any>>(
  //   id: string
  // ): (state: Flower<T>) => Data<T>
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
  ): string | undefined
  /**
   * @param nodes
   * @param current
   * @returns
   */
  makeSelectCurrentNodeDisabled<T extends Record<string, any>>(
    nodes: { [x: string]: Partial<INode> },
    current: Flower<T>['current']
  ): boolean
}

export interface IDataSelectors {
  /**
   * @param state
   * @returns
   */
  selectGlobalReducerByName(
    name: string
  ): (state: Record<string, Record<string, unknown>>) => Record<string, unknown>
  /**
   * @param state
   * @returns
   */
  selectGlobalData<T extends Record<string, any>>(state: {
    [REDUCER_NAME.FLOWER_DATA]: { [x: string]: Data<T> }
  }): { [x: string]: Data<T> }
  /**
   * @param data
   * @returns
   */
  makeSelectNodeErrors<T extends Record<string, any>>(
    data: Data<T> | undefined
  ): {
    isSubmitted: boolean
    isDirty: boolean
    hasFocus: string | undefined
    errors: any
    customErrors: any
    isValid: boolean
    isValidating?: boolean
  }
  /**
   * @param data
   * @returns
   */
  makeSelectNodeDataFieldTouched<T extends Record<string, any>>(
    id: string
  ): (data: Data<T> | undefined) => boolean | undefined
  /**
   * @param data
   * @returns
   */
  makeSelectNodeDataFieldFocused<T extends Record<string, any>>(
    id: string
  ): (data: Data<T> | undefined) => string | undefined
  /**
   * @param data
   * @returns
   */
  makeSelectNodeDataFieldDirty<T extends Record<string, any>>(
    id: string
  ): (data: Data<T> | undefined) => boolean | undefined
  // /**
  //  * @param flower
  //  * @returns
  //  */
  // getDataByFlow<T extends Record<string, any>>(flower: Flower<T>): T
  /**
   * @param id
   * @returns
   */
  getDataFromState<T extends Record<string, any>>(
    id: string | string[]
  ): (data: T) => Partial<T>
  /**
   * @param data
   * @returns
   */
  makeSelectNodeDataSubmitted<T extends Record<string, any>>(
    data: Data<T>
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
  ): (globalData: T | undefined, data: Data<T>) => Array<string>
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
  ): (globalData: T | undefined, data: Data<T>) => boolean
}
