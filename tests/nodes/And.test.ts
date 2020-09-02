import '../helper.js'

import And from '../../src/nodes/And.js'
import As from '../../src/nodes/As.js'
import SQLLiteral from '../../src/nodes/SQLLiteral.js'

describe('And', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new And(['foo', 'bar']), new And(['foo', 'bar'])]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new And(['foo', 'bar']), new And(['foo', 'baz'])]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })

  describe('functions as node expression', () => {
    test('allows aliasing', () => {
      const aliased = new And(['foo', 'bar']).as('baz')

      expect(aliased).toBeInstanceOf(As)
      expect(aliased.right).toBeInstanceOf(SQLLiteral)
    })
  })
})
