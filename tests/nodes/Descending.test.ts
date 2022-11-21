import '../helper'

import Ascending from '../../src/nodes/Ascending'
import Descending from '../../src/nodes/Descending'

describe('Descending', () => {
  test('construct', () => {
    const descending = new Descending('zomg')
    expect(descending.expr).toStrictEqual('zomg')
  })

  test('reverse', () => {
    const descending = new Descending('zomg')
    const ascending = descending.reverse()

    expect(ascending).toBeInstanceOf(Ascending)
    expect(ascending.expr).toStrictEqual(descending.expr)
  })

  test('direction', () => {
    const descending = new Descending('zomg')

    expect(descending.direction).toStrictEqual('desc')
  })

  test('ascending?', () => {
    const descending = new Descending('zomg')

    expect(descending.isAscending).toBeFalsy()
  })

  test('descending?', () => {
    const descending = new Descending('zomg')

    expect(descending.isDescending).toBeTruthy()
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Descending('zomg'), new Descending('zomg')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Descending('zomg'), new Descending('zomg!')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
