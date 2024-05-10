import { RulesByNodeId } from './CoreInterface';

export enum RulesModes {
  $and = '$and',
  $or = '$or',
}

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
  $regex = '$regex',
}

type RulesValuesType<T> = { '$form.isValid': boolean } & T;

type RulesOperatorsInArray<T> = Partial<{
  [KEY in keyof T]: Partial<{
    [K in keyof typeof RulesOperators]: T[KEY];
  }>;
}>;
export type RulesObject<T> =
  | {
      [K in keyof typeof RulesModes]:
        | Array<RulesOperatorsInArray<RulesValuesType<T>>>
        | Array<RulesObject<RulesValuesType<T>>>;
    }
  | Array<RulesOperatorsInArray<RulesValuesType<T>>>;

export interface StoreRoot<T extends Record<string, any>> {
  flower: { [x: string]: Flower<T> };
}

export interface Flower<T extends Record<string, any>> {
  persist: boolean;
  startId: string;
  current: string;
  history: string[];
  nodes: { [x: string]: Node };
  //TODO: REMOVE ANY
  nextRules: { [x: string]: RulesByNodeId<T>[]  };
  data: T;
  form: { [x: string]: Form<T> };
}

export interface Node {
  nodeId: string;
  nodeType: string;
  retain?: boolean;
  disabled?: boolean;
}

export type Form<T> = {
  touched?: boolean;
  isValidating?: boolean;
  errors?: { [K in keyof T]: Array<string> };
};
