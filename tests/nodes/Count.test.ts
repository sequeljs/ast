import '../helper'

import Count from '../../src/nodes/Count'

import Table from '../../src/Table'

describe('Count', () => {
  describe('as', () => {
    test('should alias the count', () => {
      const table = new Table('users')

      expect(table.get('id').count().as('foo').toSQL()).toStrictEqual(
        `COUNT("users"."id") AS foo`,
      )
    })
  })

  describe('eq', () => {
    const table = new Table('users')

    expect(table.get('id').count().eq(2).toSQL()).toStrictEqual(
      `COUNT("users"."id") = 2`,
    )
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Count('foo'), new Count('foo')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Count('foo'), new Count('foo!')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })

  describe('math', () => {
    test('allows mathematical functions', () => {
      const table = new Table('users')

      expect(table.get('id').count().add(1).toSQL()).toStrictEqual(
        `(COUNT("users"."id") + 1)`,
      )
    })
  })
})
