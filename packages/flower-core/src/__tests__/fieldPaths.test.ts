import {
  readExternalValue,
  resolveFieldPath
} from '../utils/fieldPaths'
import {
  clearExternalReducers,
  registerExternalReducers
} from '../externalReducers'

describe('fieldPaths utils', () => {
  beforeEach(() => {
    clearExternalReducers()
    registerExternalReducers(['external'])
  })

  it('resolves regular field paths with flowName fallback', () => {
    const result = resolveFieldPath('form.field', 'defaultFlow')

    expect(result.path).toEqual(['form', 'field'])
    expect(result.flowNameFromPath).toEqual('defaultFlow')
    expect(result.isExternal).toBe(false)
    expect(result.externalPath).toBeUndefined()
  })

  it('resolves external paths starting with ^ and marks them as external', () => {
    const result = resolveFieldPath('^external.values.message', 'defaultFlow')

    expect(result.path).toEqual([])
    expect(result.externalPath).toEqual(['external', 'values', 'message'])
    expect(result.isExternal).toBe(true)
    expect(result.flowNameFromPath).toEqual('defaultFlow')
  })

  it('reads deeply nested external values', () => {
    const state = {
      external: {
        nested: {
          message: 'hello'
        }
      }
    }

    expect(readExternalValue(state, ['external', 'nested', 'message'])).toBe(
      'hello'
    )
    expect(readExternalValue(state, undefined)).toBeUndefined()
  })
})
