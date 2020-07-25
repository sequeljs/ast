import '../helper'

import Ascending from '../../src/nodes/Ascending'
import Descending from '../../src/nodes/Descending'

describe('Ascending', () => {
  test('construct', () => {
    const ascending = new Ascending('zomg')
    expect(ascending.expr).toStrictEqual('zomg')
  })

  test('reverse', () => {
    const ascending = new Ascending('zomg')
    const descending = ascending.reverse()

    expect(descending).toBeInstanceOf(Descending)
    expect(descending.expr).toStrictEqual(ascending.expr)
  })

  test('direction', () => {
    const ascending = new Ascending('zomg')

    expect(ascending.direction).toStrictEqual('asc')
  })

  test('ascending?', () => {
    const ascending = new Ascending('zomg')

    expect(ascending.isAscending).toBeTruthy()
  })

  test('descending?', () => {
    const ascending = new Ascending('zomg')

    expect(ascending.isDescending).toBeFalsy()
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Ascending('zomg'), new Ascending('zomg')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Ascending('zomg'), new Ascending('zomg!')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
