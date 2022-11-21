import '../helper'

import Or from '../../src/nodes/Or'

import Table from '../../src/Table'

import type Equality from '../../src/nodes/Equality'

describe('Or', () => {
  describe('or', () => {
    test('makes an OR node', () => {
      const attribute = new Table('users').get('id')

      const left = attribute.eq(10)
      const right = attribute.eq(11)

      const node = left.or(right)

      expect((node.expr as Equality).left).toStrictEqual(left)
      expect((node.expr as Equality).right).toStrictEqual(right)
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Or('foo', 'bar'), new Or('foo', 'bar')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Or('foo', 'bar'), new Or('foo', 'baz')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
