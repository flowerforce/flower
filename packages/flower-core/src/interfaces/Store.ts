import { RulesByNodeId } from './CoreInterface'

export interface Flower<T extends Record<string, any>> {
  persist: boolean
  startId: string
  current: string
  history: string[]
  nodes: { [x: string]: INode }
  //TODO: REMOVE ANY
  nextRules: { [x: string]: RulesByNodeId<T>[] }
}

export interface INode {
  nodeId: string
  nodeType: string
  retain?: boolean
  disabled?: boolean
}

export type Form<T extends Record<string, unknown>> = {
  isSubmitted?: boolean
  isDirty?: boolean
  hasFocus?: string
  isValidating?: boolean
  errors?: { [K in keyof T]: Array<string> }
  customErrors?: { [K in keyof T]: Array<string> }
  dirty?: { [K in keyof T]: boolean }
  touches?: { [K in keyof T]: boolean }
  data?: T
}
