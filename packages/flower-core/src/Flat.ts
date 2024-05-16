/* istanbul ignore file */
import {
  KeyIdentity,
  Flatten,
  FlattenStep,
  GetKey,
  Unflatten
} from './interfaces/FlatInterface'
import { get, isBuffer } from 'lodash'

const keyIdentity: KeyIdentity = (key) => key

const flatten: Flatten = (target, opts) => {
  const options = opts ?? {}

  const safe = get(options, 'safe', false)
  const maxDepth = get(options, 'maxDepth', 0)
  const delimiter = get(options, 'delimiter', '.')
  const transformKey = get(options, 'transformKey', keyIdentity)
  const output: { [x: string]: any } = {}

  const step: FlattenStep = (object, prev, currentDepth) => {
    const depth = currentDepth || 1
    Object.keys(object).forEach((key) => {
      const value = object[key]
      const isarray = safe && Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isbuffer = isBuffer(value)
      const isobject = type === '[object Object]' || type === '[object Array]'

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key)

      if (
        !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        (!maxDepth || depth < maxDepth)
      ) {
        return step(value, newKey, depth + 1)
      }

      output[newKey] = value
    })
  }

  step(target)

  return output
}

const unflatten: Unflatten = (target, opts) => {
  const options = opts ?? {}

  const object = get(options, 'object', false)
  const overwrite = get(options, 'overwrite', false)
  const delimiter = get(options, 'delimiter', '.')
  const transformKey = get(options, 'transformKey', keyIdentity)

  const result: { [x: string]: any } = {}

  const isbuffer = isBuffer(target)
  if (
    isbuffer ||
    Object.prototype.toString.call(target) !== '[object Object]'
  ) {
    return target
  }

  // safely ensure that the key is
  // an integer.
  const getkey: GetKey = (key) => {
    const parsedKey = Number(key)

    return isNaN(parsedKey) || key?.indexOf('.') !== -1 || object
      ? key
      : parsedKey
  }

  function addKeys(
    keyPrefix: string,
    recipient: { [x: string]: any },
    target: { [x: string]: any }
  ) {
    return Object.keys(target).reduce((result, key) => {
      result[keyPrefix + delimiter + key] = target[key]

      return result
    }, recipient)
  }

  function isEmpty(val: unknown) {
    const type = Object.prototype.toString.call(val)
    const isArray = type === '[object Array]'
    const isObject = type === '[object Object]'

    if (!val) {
      return true
    }
    if (isArray) {
      return !(val as Array<any>).length
    }
    if (isObject) {
      return !Object.keys(val).length
    }
  }

  target = Object.keys(target).reduce<{ [x: string]: any }>((result, key) => {
    const type = Object.prototype.toString.call(target[key])
    const isObject = type === '[object Object]' || type === '[object Array]'
    if (!isObject || isEmpty(target[key])) {
      result[key] = target[key]
      return result
    }
    return addKeys(key, result, flatten(target[key], opts))
  }, {})

  Object.keys(target).forEach((key) => {
    const split = key.split(delimiter).map(transformKey)
    let key1 = getkey(split.shift())
    let key2 = getkey(split[0])
    let recipient = result

    while (key2 !== undefined) {
      const recipient_key_1 = key1 && get(recipient, key1)
      const type = Object.prototype.toString.call(recipient_key_1)
      const isobject = type === '[object Object]' || type === '[object Array]'

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient_key_1 !== 'undefined') {
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient_key_1 == null)) {
        recipient[key1!] = typeof key2 === 'number' && !object ? [] : {}
      }

      recipient = key1 && get(recipient, key1)
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1!] = unflatten(target[key], opts)
  })

  return result
}

export const flat = {
  /**
   * @param target
   * @param opts
   *
   * Takes a target object and options as input and returns a flattened version of the object.
   *
   * @returns
   */
  flatten,
  /**
   * @param target
   * @param opts
   *
   * Takes a target object and options as input and returns a unflattened version of the object.
   *
   * @returns
   */
  unflatten
}
