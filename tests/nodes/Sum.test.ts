import '../helper.js'

import Sum from '../../src/nodes/Sum.js'

import Table from '../../src/Table.js'

describe('Sum', () => {
  describe('as', () => {
    test('should alias the sum', () => {
      const table = new Table('users')

      expect(table.get('id').sum().as('foo').toSQL()).toStrictEqual(
        `SUM("users"."id") AS foo`,
      )
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Sum('foo'), new Sum('foo')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Sum('foo'), new Sum('bar')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })

  describe('order', () => {
    test('should order the sum', () => {
      const table = new Table('users')

      expect(table.get('id').sum().desc().toSQL()).toStrictEqual(
        `SUM("users"."id") DESC`,
      )
    })
  })
})
