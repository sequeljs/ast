import '../helper'

import And from '../../src/nodes/And'

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
})
