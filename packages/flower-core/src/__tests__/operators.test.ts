import { Operators } from '../rules-matcher/interface'
import rulesMatcherUtils from '../rules-matcher/utils'
import _intersection from 'lodash/intersection'

const operators: Operators = {
  $exists: (a, b) => !rulesMatcherUtils.isEmpty(a) === b,

  $eq: (a, b) => a === b,

  $ne: (a, b) => a !== b,

  $gt: (a, b) => rulesMatcherUtils.forceNumber(a) > parseFloat(b),

  $gte: (a, b) => rulesMatcherUtils.forceNumber(a) >= parseFloat(b),

  $lt: (a, b) => rulesMatcherUtils.forceNumber(a) < parseFloat(b),

  $lte: (a, b) => rulesMatcherUtils.forceNumber(a) <= parseFloat(b),

  $strGt: (a, b) => String(a || '').length > parseFloat(b),

  $strGte: (a, b) => String(a || '').length >= parseFloat(b),

  $strLt: (a, b) => String(a || '').length < parseFloat(b),

  $strLte: (a, b) => String(a || '').length <= parseFloat(b),

  $in: (a, b) =>
    rulesMatcherUtils
      .forceArray(b)
      .some(
        (c) =>
          _intersection(
            rulesMatcherUtils.forceArray(a),
            rulesMatcherUtils.forceArray(c)
          ).length
      ),

  $nin: (a, b) =>
    !rulesMatcherUtils
      .forceArray(b)
      .some(
        (c) =>
          _intersection(
            rulesMatcherUtils.forceArray(a),
            rulesMatcherUtils.forceArray(c)
          ).length
      ),

  $all: (a, b) =>
    rulesMatcherUtils
      .forceArray(b)
      .every(
        (c) =>
          _intersection(
            rulesMatcherUtils.forceArray(a),
            rulesMatcherUtils.forceArray(c)
          ).length
      ),

  $regex: (a, b, opt) =>
    rulesMatcherUtils
      .forceArray(b)
      .some((c) =>
        c instanceof RegExp ? c.test(a) : new RegExp(c, opt).test(a)
      )
}

describe('Operators tests', () => {
  describe('$exists - exists', () => {
    it('returns true if checked element exists and pass true as second parameter', () => {
      const test_value = 'ciao'
      const result = operators['$exists'](test_value, true)
      expect(result).toEqual(true)
    })
    it('returns false if checked element exists and pass false as second parameter', () => {
      const test_value = 'ciao'
      const result = operators['$exists'](test_value, false)
      expect(result).toEqual(false)
    })
    it('returns false if checked element does not exists and pass true as second parameter', () => {
      const test_value = undefined
      const result = operators['$exists'](test_value, true)
      expect(result).toEqual(false)
    })
    it('returns true if checked element does not exists and pass false as second parameter', () => {
      const test_value = undefined
      const result = operators['$exists'](test_value, false)
      expect(result).toEqual(true)
    })
  })
  describe('$eq - equal', () => {
    it('returns true if elements are strictly equal', () => {
      const value_1 = 10
      const value_2 = 10
      const result = operators['$eq'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if elements are not strictly equal', () => {
      const value_1 = 10
      const value_2 = '10'
      const result = operators['$eq'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$ne - not equal', () => {
    it('returns true if elements are strictly different', () => {
      const value_1 = 10
      const value_2 = 10
      const result = operators['$ne'](value_1, value_2)
      expect(result).toEqual(false)
    })
    it('returns false if elements are not strictly equal', () => {
      const value_1 = 10
      const value_2 = '10'
      const result = operators['$ne'](value_1, value_2)
      expect(result).toEqual(true)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$gt - greater than', () => {
    it('returns true if first value is greater than second element', () => {
      const value_1 = 20
      const value_2 = 10
      const result = operators['$gt'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not greater than second element', () => {
      const value_1 = 10
      const value_2 = 10
      const result = operators['$gt'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$gte - greater than or equal', () => {
    it('returns true if first value is greater than or equal second element', () => {
      const value_1 = 20
      const value_2 = 10
      const result = operators['$gte'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not greater than or equal second element', () => {
      const value_1 = 10
      const value_2 = 20
      const result = operators['$gte'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$lt - less than', () => {
    it('returns true if first value is less than second element', () => {
      const value_1 = 10
      const value_2 = 20
      const result = operators['$lt'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not less than second element', () => {
      const value_1 = 10
      const value_2 = 10
      const result = operators['$lt'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$lte - less than or equal', () => {
    it('returns true if first value is less than or equal second element', () => {
      const value_1 = 10
      const value_2 = 20
      const result = operators['$lte'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not less than or equal second element', () => {
      const value_1 = 20
      const value_2 = 10
      const result = operators['$lte'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$strGt - string greater than', () => {
    it('returns true if first value is longer than the second one', () => {
      const value_1 = 'ciao'
      const value_2 = 2
      const result = operators['$strGt'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not longer than the second one', () => {
      const value_1 = 'hi'
      const value_2 = 4
      const result = operators['$strGt'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$strGte - string greater than or equal', () => {
    it('returns true if first value is longer than the second one', () => {
      const value_1 = 'ciao'
      const value_2 = 2
      const result = operators['$strGte'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not longer than the second one', () => {
      const value_1 = 'hi'
      const value_2 = 4
      const result = operators['$strGte'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$strLt - string less than', () => {
    it('returns true if first value is shorter than the second one', () => {
      const value_1 = 'hi'
      const value_2 = 4
      const result = operators['$strLt'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not shorter than the second one', () => {
      const value_1 = 'ciao'
      const value_2 = 2
      const result = operators['$strLt'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$strLte - string less than or equal', () => {
    it('returns true if first value is shorter than or equal the second one', () => {
      const value_1 = 'hi'
      const value_2 = 4
      const result = operators['$strLte'](value_1, value_2)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not shorter than or equal the second one', () => {
      const value_1 = 'ciao'
      const value_2 = 2
      const result = operators['$strLte'](value_1, value_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$in - element in collection', () => {
    it('returns true if value is found inside collection', () => {
      const value_1 = 'ciao'
      const collection = [
        'ciao',
        'Ahoj',
        'Alo',
        'Annyeonghaseyo',
        'Ave',
        'Cześć'
      ]
      const result = operators['$in'](value_1, collection)
      expect(result).toEqual(true)
    })
    it('returns false if first value is not found inside collection', () => {
      const value_1 = 'ciao'
      const collection = ['Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave', 'Cześć']
      const result = operators['$in'](value_1, collection)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$nin - element not in collection', () => {
    it('returns true if value is not found inside collection', () => {
      const value_1 = 'ciao'
      const collection = ['Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave', 'Cześć']
      const result = operators['$nin'](value_1, collection)
      expect(result).toEqual(true)
    })
    it('returns false if first value is found inside collection', () => {
      const value_1 = 'ciao'
      const collection = [
        'ciao',
        'Ahoj',
        'Alo',
        'Annyeonghaseyo',
        'Ave',
        'Cześć'
      ]
      const result = operators['$nin'](value_1, collection)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  describe('$all - all elements in collection', () => {
    it('returns true if collections are equal', () => {
      const collection_1 = ['ciao', 'Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
      const collection_2 = ['ciao', 'Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
      const result = operators['$all'](collection_1, collection_2)
      expect(result).toEqual(true)
    })
    it('returns false if collections are not equal', () => {
      const collection_1 = ['Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
      const collection_2 = ['ciao', 'Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
      const result = operators['$all'](collection_1, collection_2)
      expect(result).toEqual(false)
    })
    // TODO ADD MORE COMBINATIONS
  })
  //   describe('$regex - all elements in collection', () => {
  //     it('returns true if collections are equal', () => {
  //       const collection_1 = ['ciao', 'Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
  //       const collection_2 = ['ciao', 'Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
  //       const result = operators['$regex'](collection_1, collection_2)
  //       expect(result).toEqual(true)
  //     })
  //     it('returns false if collections are not equal', () => {
  //       const collection_1 = ['Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
  //       const collection_2 = ['ciao', 'Ahoj', 'Alo', 'Annyeonghaseyo', 'Ave']
  //       const result = operators['$regex'](collection_1, collection_2)
  //       expect(result).toEqual(false)
  //     })
  //     // TODO ADD MORE COMBINATIONS
  //   })
})
