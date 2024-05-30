import { RulesByNodeId, RulesModes } from './CoreInterface'

export enum RulesOperators {
  $exist = '$exist',
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

export interface StoreRoot<T extends Record<string, any>> {
  flower: { [x: string]: Flower<T> }
}

export interface Flower<T extends Record<string, any>> {
  persist: boolean
  startId: string
  current: string
  history: string[]
  nodes: { [x: string]: INode }
  //TODO: REMOVE ANY
  nextRules: { [x: string]: RulesByNodeId<T>[] }
  data: T
  form: { [x: string]: Form<T> }
}

export interface INode {
  nodeId: string
  nodeType: string
  retain?: boolean
  disabled?: boolean
}

export type Form<T> = {
  touched?: boolean
  isValidating?: boolean
  errors?: { [K in keyof T]: Array<string> }
}
