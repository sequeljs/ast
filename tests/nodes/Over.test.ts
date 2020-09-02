import '../helper.js'

import Over from '../../src/nodes/Over.js'
import SQLLiteral from '../../src/nodes/SQLLiteral.js'
import Window from '../../src/nodes/Window.js'

import Table from '../../src/Table.js'

describe('Over', () => {
  test('construct', () => {
    const over = new Over('foo')

    expect(over.left).toStrictEqual('foo')
  })

  describe('as', () => {
    test('should alias the expression', () => {
      const table = new Table('users')

      expect(table.get('id').count().over().as('foo').toSQL()).toStrictEqual(
        `COUNT("users"."id") OVER () AS foo`,
      )
    })
  })

  describe('with literal', () => {
    test('should reference the window definition by name', () => {
      const table = new Table('users')

      expect(table.get('id').count().over('foo').toSQL()).toStrictEqual(
        `COUNT("users"."id") OVER "foo"`,
      )
    })
  })

  describe('with SQL literal', () => {
    test('should reference the window definition by name', () => {
      const table = new Table('users')

      expect(
        table.get('id').count().over(new SQLLiteral('foo')).toSQL(),
      ).toStrictEqual(`COUNT("users"."id") OVER foo`)
    })
  })

  describe('with no expression', () => {
    test('should use empty definition', () => {
      const table = new Table('users')

      expect(table.get('id').count().over().toSQL()).toStrictEqual(
        `COUNT("users"."id") OVER ()`,
      )
    })
  })

  describe('with expression', () => {
    test('should use definition in sub-expression', () => {
      const table = new Table('users')

      const window = new Window().order(table.get('foo'))

      expect(table.get('id').count().over(window).toSQL()).toStrictEqual(
        `COUNT("users"."id") OVER (ORDER BY "users"."foo")`,
      )
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Over('foo', 'bar'), new Over('foo', 'bar')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Over('foo', 'bar'), new Over('foo', 'baz')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
