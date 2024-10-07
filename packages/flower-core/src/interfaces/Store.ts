import { RulesByNodeId, RulesModes } from './CoreInterface'

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
  isSubmitted?: boolean
  isDirty?: boolean
  hasFocus?: string
  isValidating?: boolean
  errors?: { [K in keyof T]: Array<string> }
  customErrors?: { [K in keyof T]: Array<string> }
  dirty?: { [K in keyof T]: boolean }
  touches?: { [K in keyof T]: boolean }
}
