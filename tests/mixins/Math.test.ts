import '../helper'

import Table from '../../src/Table'

describe('Math', () => {
  describe('multiply', () => {
    test('average should be compatible with multiply', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().multiply(2).toSQL()).toStrictEqual(
        'AVG("users"."id") * 2',
      )
    })

    test('count should be compatible with multiply', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().multiply(2).toSQL()).toStrictEqual(
        'COUNT("users"."id") * 2',
      )
    })

    test('maximum should be compatible with multiply', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().multiply(2).toSQL()).toStrictEqual(
        'MAX("users"."id") * 2',
      )
    })

    test('minimum should be compatible with multiply', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().multiply(2).toSQL()).toStrictEqual(
        'MIN("users"."id") * 2',
      )
    })

    test('attribute node should be compatible with multiply', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.multiply(2).toSQL()).toStrictEqual('"users"."id" * 2')
    })
  })

  describe('divide', () => {
    test('average should be compatible with divide', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().divide(2).toSQL()).toStrictEqual(
        'AVG("users"."id") / 2',
      )
    })

    test('count should be compatible with divide', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().divide(2).toSQL()).toStrictEqual(
        'COUNT("users"."id") / 2',
      )
    })

    test('maximum should be compatible with divide', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().divide(2).toSQL()).toStrictEqual(
        'MAX("users"."id") / 2',
      )
    })

    test('minimum should be compatible with divide', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().divide(2).toSQL()).toStrictEqual(
        'MIN("users"."id") / 2',
      )
    })

    test('attribute node should be compatible with divide', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.divide(2).toSQL()).toStrictEqual('"users"."id" / 2')
    })
  })

  describe('add', () => {
    test('average should be compatible with add', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().add(2).toSQL()).toStrictEqual(
        '(AVG("users"."id") + 2)',
      )
    })

    test('count should be compatible with add', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().add(2).toSQL()).toStrictEqual(
        '(COUNT("users"."id") + 2)',
      )
    })

    test('maximum should be compatible with add', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().add(2).toSQL()).toStrictEqual(
        '(MAX("users"."id") + 2)',
      )
    })

    test('minimum should be compatible with add', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().add(2).toSQL()).toStrictEqual(
        '(MIN("users"."id") + 2)',
      )
    })

    test('attribute node should be compatible with add', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.add(2).toSQL()).toStrictEqual('("users"."id" + 2)')
    })
  })

  describe('subtract', () => {
    test('average should be compatible with subtract', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().subtract(2).toSQL()).toStrictEqual(
        '(AVG("users"."id") - 2)',
      )
    })

    test('count should be compatible with subtract', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().subtract(2).toSQL()).toStrictEqual(
        '(COUNT("users"."id") - 2)',
      )
    })

    test('maximum should be compatible with subtract', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().subtract(2).toSQL()).toStrictEqual(
        '(MAX("users"."id") - 2)',
      )
    })

    test('minimum should be compatible with subtract', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().subtract(2).toSQL()).toStrictEqual(
        '(MIN("users"."id") - 2)',
      )
    })

    test('attribute node should be compatible with subtract', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.subtract(2).toSQL()).toStrictEqual('("users"."id" - 2)')
    })
  })

  describe('bitwiseAnd', () => {
    test('average should be compatible with bitwiseAnd', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().bitwiseAnd(2).toSQL()).toStrictEqual(
        '(AVG("users"."id") & 2)',
      )
    })

    test('count should be compatible with bitwiseAnd', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().bitwiseAnd(2).toSQL()).toStrictEqual(
        '(COUNT("users"."id") & 2)',
      )
    })

    test('maximum should be compatible with bitwiseAnd', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().bitwiseAnd(2).toSQL()).toStrictEqual(
        '(MAX("users"."id") & 2)',
      )
    })

    test('minimum should be compatible with bitwiseAnd', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().bitwiseAnd(2).toSQL()).toStrictEqual(
        '(MIN("users"."id") & 2)',
      )
    })

    test('attribute node should be compatible with bitwiseAnd', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.bitwiseAnd(2).toSQL()).toStrictEqual(
        '("users"."id" & 2)',
      )
    })
  })

  describe('bitwiseOr', () => {
    test('average should be compatible with bitwiseOr', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().bitwiseOr(2).toSQL()).toStrictEqual(
        '(AVG("users"."id") | 2)',
      )
    })

    test('count should be compatible with bitwiseOr', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().bitwiseOr(2).toSQL()).toStrictEqual(
        '(COUNT("users"."id") | 2)',
      )
    })

    test('maximum should be compatible with bitwiseOr', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().bitwiseOr(2).toSQL()).toStrictEqual(
        '(MAX("users"."id") | 2)',
      )
    })

    test('minimum should be compatible with bitwiseOr', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().bitwiseOr(2).toSQL()).toStrictEqual(
        '(MIN("users"."id") | 2)',
      )
    })

    test('attribute node should be compatible with bitwiseOr', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.bitwiseOr(2).toSQL()).toStrictEqual('("users"."id" | 2)')
    })
  })

  describe('bitwiseNot', () => {
    test('average should be compatible with bitwiseNot', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().bitwiseNot().toSQL()).toStrictEqual(
        ' ~ AVG("users"."id")',
      )
    })

    test('count should be compatible with bitwiseNot', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().bitwiseNot().toSQL()).toStrictEqual(
        ' ~ COUNT("users"."id")',
      )
    })

    test('maximum should be compatible with bitwiseNot', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().bitwiseNot().toSQL()).toStrictEqual(
        ' ~ MAX("users"."id")',
      )
    })

    test('minimum should be compatible with bitwiseNot', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().bitwiseNot().toSQL()).toStrictEqual(
        ' ~ MIN("users"."id")',
      )
    })

    test('attribute node should be compatible with bitwiseNot', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.bitwiseNot().toSQL()).toStrictEqual(' ~ "users"."id"')
    })
  })

  describe('bitwiseShiftLeft', () => {
    test('average should be compatible with bitwiseShiftLeft', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().bitwiseShiftLeft(2).toSQL()).toStrictEqual(
        '(AVG("users"."id") << 2)',
      )
    })

    test('count should be compatible with bitwiseShiftLeft', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().bitwiseShiftLeft(2).toSQL()).toStrictEqual(
        '(COUNT("users"."id") << 2)',
      )
    })

    test('maximum should be compatible with bitwiseShiftLeft', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().bitwiseShiftLeft(2).toSQL()).toStrictEqual(
        '(MAX("users"."id") << 2)',
      )
    })

    test('minimum should be compatible with bitwiseShiftLeft', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().bitwiseShiftLeft(2).toSQL()).toStrictEqual(
        '(MIN("users"."id") << 2)',
      )
    })

    test('attribute node should be compatible with bitwiseShiftLeft', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.bitwiseShiftLeft(2).toSQL()).toStrictEqual(
        '("users"."id" << 2)',
      )
    })
  })

  describe('bitwiseShiftRight', () => {
    test('average should be compatible with bitwiseShiftRight', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.average().bitwiseShiftRight(2).toSQL()).toStrictEqual(
        '(AVG("users"."id") >> 2)',
      )
    })

    test('count should be compatible with bitwiseShiftRight', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.count().bitwiseShiftRight(2).toSQL()).toStrictEqual(
        '(COUNT("users"."id") >> 2)',
      )
    })

    test('maximum should be compatible with bitwiseShiftRight', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.maximum().bitwiseShiftRight(2).toSQL()).toStrictEqual(
        '(MAX("users"."id") >> 2)',
      )
    })

    test('minimum should be compatible with bitwiseShiftRight', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.minimum().bitwiseShiftRight(2).toSQL()).toStrictEqual(
        '(MIN("users"."id") >> 2)',
      )
    })

    test('attribute node should be compatible with bitwiseShiftRight', () => {
      const table = new Table('users')
      const attribute = table.get('id')

      expect(attribute.bitwiseShiftRight(2).toSQL()).toStrictEqual(
        '("users"."id" >> 2)',
      )
    })
  })
})
