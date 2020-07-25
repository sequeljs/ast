import '../helper'

import Not from '../../src/nodes/Not'

import Table from '../../src/Table'

describe('Not', () => {
  describe('not', () => {
    test('makes a NOT node', () => {
      const attribute = new Table('users').get('id')

      const expression = attribute.eq(10)

      const node = expression.not()

      expect(node).toBeInstanceOf(Not)
      expect(node.expr).toStrictEqual(expression)
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Not('foo'), new Not('foo')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Not('foo'), new Not('baz')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
