import '../helper.js'

import Grouping from '../../src/nodes/Grouping.js'
import buildQuoted from '../../src/nodes/buildQuoted.js'

describe('Grouping', () => {
  test('should create Equality nodes', () => {
    const grouping = new Grouping(buildQuoted('foo'))

    expect(grouping.eq('foo').toSQL()).toStrictEqual(`('foo') = 'foo'`)
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Grouping('foo'), new Grouping('foo')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Grouping('foo'), new Grouping('bar')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
