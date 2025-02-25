import { RulesObject } from './CoreInterface'

export type CheckTypeOf = (v: any) => boolean

export type CheckOperationObj = {
  op: keyof Operators
  value: any
  opt?: any
}

export interface RulesMatcherUtils {
  /**
   * @param el
   *
   * Determines if a given value is a number.
   * It checks if the value matches a numeric pattern using a regular expression.
   *
   * @returns
   */
  isNumber: <T>(el: T) => boolean
  /**
   * @param val
   * @param data
   * @param options
   *
   * Processes a single rule against provided data to check its validity.
   * Returns a boolean indicating whether the rule is valid and a name for the rule.
   *
   * @returns
   */
  rule: (
    block: Record<string, any>,
    keys: Record<string, any>,
    options: Record<string, any>
  ) => {
    valid: boolean
    name: string
  }
  /**
   * @param block
   * @param keys
   * @param options
   *
   * Extracts keys from a rule object.
   * It recursively traverses through the rule object and extracts keys while handling $and and $or logical operators.
   *
   * @returns
   */
  getKey: (
    block: RulesObject<any>,
    keys: Record<string, any>,
    options: Record<string, any>
  ) => Record<string, any>
  /**
   * @param v
   *
   * Checks if a given value is a Date object.
   *
   * @returns
   */
  isDate: CheckTypeOf
  /**
   * @param v
   *
   * Checks if a given value is defined (neither null nor undefined).
   *
   * @returns
   */
  isDefined: CheckTypeOf
  /**
   * @param v
   *
   * Checks if a given value is an object (it will return true if pass an Array).
   *
   * @returns
   */
  isObject: CheckTypeOf
  /**
   * @param v
   *
   * Checks if a given value is a function.
   *
   * @returns
   */
  isFunction: CheckTypeOf
  /**
   * @param v
   *
   * Checks if a given value is a string.
   *
   * @returns
   */
  isString: CheckTypeOf
  /**
   * @param value
   *
   * Returns the default comparison operation for a string value.
   *
   * @returns
   */
  getDefaultStringValue: (
    value: '$required' | '$exists' | string
  ) => CheckOperationObj
  /**
   * @param value
   *
   * Determines the type of a given value.
   *
   * @returns
   */
  getTypeOf: (value: any) => string | null
  /**
   * @param value
   *
   * Returns the default rule configuration based on the type of the value.
   *
   * @returns
   */
  getDefaultRule: (value: any) => CheckOperationObj
  /**
   * @param value
   *
   * Checks if a value is empty.
   * Handles various data types including null, undefined, functions, strings, arrays, objects, and dates.
   *
   * @returns
   */
  isEmpty: (value: any) => boolean
  /**
   * @param a
   *
   * Converts a value into an array if it is not already.
   *
   * @returns
   */
  forceArray: <T>(value: T) => Array<T>
  /**
   * @param path
   * @param prefix
   *
   * Constructs a path with a prefix if provided.
   * Handles special characters such as '^' and '$'.
   *
   * @returns
   */
  getPath: (path: string, prefix?: string) => string
  /**
   * @param el
   *
   * Converts a value into a number.
   * Handles cases where the value might be a string representation of a number or an array.
   *
   * @returns
   */
  forceNumber: <T>(value: T) => number
  /**
   * @param block
   * @param data
   * @param options
   *
   * Checks if a given rule is valid against the provided data.
   *
   * @returns
   */
  checkRule: <T extends Record<string, any>>(
    block: RulesObject<T>,
    data: T,
    options: Record<string, any>
  ) => boolean
  /**
   * @param rules
   * @param options
   *
   * Extracts keys from a set of rules.
   *
   * @returns
   */
  getKeys: <T extends Record<string, any>>(
    rules?: T,
    options?: Record<string, any>
  ) => string[] | null
}

export type OperatorsFunction = (
  a: any,
  b: any,
  opt?: any,
  data?: any
) => boolean

export type Operators = {
  /**
   * @param a
   * @param b
   *
   * Checks if a value exists or not.
   * If the user input is not empty, it returns true if the rule value is true, otherwise false.
   *
   * @returns
   */
  $exists: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if two values are equal.
   *
   * @returns
   */
  $eq: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if two values are not equal.
   *
   * @returns
   */
  $ne: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if the user input value is greater than the rule value after converting them both to numbers.
   *
   * @returns
   */
  $gt: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if the user input value is greater than or equal to the rule value.
   *
   * @returns
   */
  $gte: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if the user input value is less than the rule value.
   *
   * @returns
   */
  $lt: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if the user input value is less than or equal to the rule value.
   *
   * @returns
   */
  $lte: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Compares the lengths of two strings and checks if the length of the user input string is greater than the rule value.
   *
   * @returns
   */
  $strGt: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Compares the lengths of two strings and checks if the length of the user input string is greater than or equal to the rule value.
   *
   * @returns
   */
  $strGte: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Compares the lengths of two strings and checks if the length of the user input string is less than the rule value.
   *
   * @returns
   */
  $strLt: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Compares the lengths of two strings and checks if the length of the user input string is less than or equal to the rule value.
   *
   * @returns
   */
  $strLte: OperatorsFunction

  /**
   * @param a
   * @param b
   *
   * Checks if the user input value is in the array of rule values.
   * It checks for intersection between the user input array and each rule value array.
   *
   * @returns
   */
  $in: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if the user input value is not in the array of rule values.
   * It checks for the absence of intersection between the user input array and each rule value array.
   *
   * @returns
   */
  $nin: OperatorsFunction
  /**
   * @param a
   * @param b
   *
   * Checks if all elements in the user input array are present in the array of rule values.
   * It checks for intersection between each element of the user input array and each rule value array.
   *
   * @returns
   */
  $all: OperatorsFunction
  /**
   * @param a
   * @param b
   * @param opt
   *
   * Performs a regular expression match on the user input value with the rule value(s).
   * It supports either a single regular expression or an array of regular expressions.
   *
   * @returns
   */
  $regex: OperatorsFunction
}
