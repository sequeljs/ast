import '../helper.js'

import As from '../../src/nodes/As.js'
import SQLLiteral from '../../src/nodes/SQLLiteral.js'

import Table from '../../src/Table.js'

describe('As', () => {
  describe('#as', () => {
    test('makes an AS node', () => {
      const attribute = new Table('users').get('id')
      const as = attribute.as(new SQLLiteral('foo'))

      expect(as.left).toStrictEqual(attribute)
      expect(as.right).toStrictEqual(new SQLLiteral('foo'))
    })

    test('converts right to SqlLiteral if a string', () => {
      const attribute = new Table('users').get('id')
      const as = attribute.as('foo')

      expect(as.right).toBeInstanceOf(SQLLiteral)
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new As('foo', 'bar'), new As('foo', 'bar')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new As('foo', 'bar'), new As('foo', 'baz')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
