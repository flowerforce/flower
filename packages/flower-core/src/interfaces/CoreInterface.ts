export enum RulesOperators {
  $exists = '$exists',
  $eq = '$eq',
  $ne = '$ne',
  $gt = '$gt',
  $gte = '$gte',
  $lt = '$lt',
  $lte = '$lte',
  $strGt = '$strGt',
  $strGte = '$strGte',
  $strLt = '$strLt',
  $strLte = '$strLte',
  $in = '$in',
  $nin = '$nin',
  $all = '$all',
  $regex = '$regex'
}

// Functions Parameters Types
export type Rules<T> = { rules: Rules<T> | string | null | undefined | T }

export type Edge<T = object> = {
  source: string
  target: string
  id?: string
  data?: { rules: RulesObject<T> }
}

export type NodeConfig = {
  nodeId: string | undefined
  nodeType: string
  nodeTitle: string
  children: Node['children']
  nextRules: ReturnType<MapEdge> | undefined
  retain: boolean
  disabled: boolean
}

export type Node = {
  nodeId: string | undefined
  nodeType: string
  nodeTitle: string
  children: Record<string, any> | Record<string, any>[] | undefined
  nextRules:
    | { [x: string]: { rules: RulesObject<any> } | RulesObject<any> }
    | undefined
  retain: boolean
  disabled: boolean

  id: string
  props: Record<string, any>
  type: Record<string, any>
  // nodeId?: string;
  // nextRules?: { [x: string]: { rules: RulesObject<any> } | RulesObject<any> };
  // to?: { [x: string]: { rules: RulesObject<any> } | RulesObject<any> };
  // children?: Array<Record<string, any>> | Record<string, any>;
}

export enum RulesModes {
  $and = '$and',
  $or = '$or'
}

type RulesValuesType<T> = {
  '$data.isValid'?: boolean
  /** @deprecated use $data.isValid instead */
  '$form.isValid'?: boolean
} & T

type RulesOperatorsInArray<T> = Partial<{
  [KEY in keyof T]: Partial<{
    [K in keyof typeof RulesOperators]: T[KEY]
  }>
}>

//TODO: FIX TYPE
export type RulesByNodeId<T extends Record<string, any>> = {
  nodeId: string
  rules: { rules: RulesObject<T> } | RulesObject<T> | null
}

type RulesWithName = {
  nodeId: string
  rules: string | { name?: string; rules: RulesObject<any> }
}

export type FunctionRule = (data: Record<string, any>) => boolean

export type RulesObject<T> =
  | RulesValuesType<T>
  | {
      [K in keyof typeof RulesModes]:
        | Array<RulesOperatorsInArray<RulesValuesType<T>>>
        | Array<RulesObject<RulesValuesType<T>>>
    }
  | Array<Exclude<RulesOperatorsInArray<RulesValuesType<T>>, undefined>>

//Functions Declaration Types
export type CleanPath = (name: string, char?: string) => string

export type GetPath = (idValue?: string) => {
  path: string | string[]
  rootName?: string
}

export type AllEqual = (...args: Array<number | string | boolean>[]) => boolean

export type FindValidRule<T = Rules<RulesObject<any>>> = (
  nextRules: { rules: { rules: T | FunctionRule } },
  value: Record<string, any>,
  prefix?: { prefix: string } | string
) => T[keyof T] | undefined

export type IsEmptyRules<T = { rules: RulesObject<any> } | RulesObject<any>> = (
  rules: T
) => boolean

export type MapEdge<K = RulesByNodeId<any>, T = K[]> = (nextNode: T) => Array<K>

export type MakeRules<
  T extends Record<string, any> = {
    rules: RulesObject<any> | object
  }
> = (rules: T) => Array<RulesByNodeId<T>>

export type HasNode = (
  state: Record<string, any>,
  name: string,
  node: string
) => boolean

export type MakeObjectRules = (nodes: NodeConfig[]) => {
  [x: string]: Node['nextRules']
}

export type GenerateNodes = (nodes: NodeConfig[]) => {
  [x: string]: Partial<Node>
}

export type MapKeysDeepLodash = (
  obj: Record<string, any>,
  cb: (...args: any) => any,
  isRecursive?: boolean
) => Record<string, any>

export type GenerateRulesName = (nextRules: RulesWithName[]) => {
  [X: string]: string
}

export interface FlowUtilitiesFunctions {
  /**
   *
   * Generates rule names from a set of rules.
   * @param nextRules
   *
   * @returns
   *
   */
  generateRulesName: GenerateRulesName
  /**
   * Recursively maps keys of an object using a callback function.
   * @param obj
   * @param cb
   * @param isRecursive
   *
   * @returns
   */
  mapKeysDeepLodash: MapKeysDeepLodash
  /**
   * Generates a object of nodes from an array of nodes, using nodeId as keys
   * @param nodes
   * @returns
   */
  generateNodes: GenerateNodes
  /**
   * Converts nodes into an object with node IDs as keys and their respective rules as values.
   * @param nodes
   *
   * @returns
   */
  makeObjectRules: MakeObjectRules
  /**
   * Checks if a node exists within a specific state.
   * @param state
   * @param name
   * @param node
   *
   * @returns
   */
  hasNode: HasNode
  /**
   * Checks if a set of rules is empty.
   * @param rules
   *
   * @returns
   */
  isEmptyRules: IsEmptyRules
  /**
   * Maps edges and sorts them moving empty rules to the bottom.
   * @param nextNode
   *
   * @returns
   */
  mapEdge: MapEdge
  /**
   * Converts a rules object into an array of rule objects.
   * @param rules
   *
   * @returns
   */
  makeRules: MakeRules
  /**
   * Checks if two arrays are equal in length and have the same elements.
   * @param arr
   * @param arr2
   *
   * @returns
   */
  allEqual: AllEqual
  /**
   * Finds the first valid rule for a given value within a set of rules.
   * @param nextRules
   * @param value
   * @param prefix
   *
   * @returns
   */
  findValidRule: FindValidRule
}
export interface DataUtilitiesFunctions {
  /**
   * Removes specified characters from the beginning of a string (default char -> '^').
   * @param name
   * @param char
   *
   * @returns
   */
  cleanPath: CleanPath
  /**
   * Creates a valid path from idValue
   * @param idValue
   *
   * @returns
   */
  getPath: GetPath
}

export interface CoreUtilitiesFunctions
  extends DataUtilitiesFunctions,
    FlowUtilitiesFunctions {}
