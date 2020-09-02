import '../helper.js'

import NamedWindow from '../../src/nodes/NamedWindow.js'

describe('NamedWindow', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const window1 = new NamedWindow('foo')
      window1.orders = [1, 2]
      window1.partitions = [1]
      window1.frame(3)

      const window2 = new NamedWindow('foo')
      window2.orders = [1, 2]
      window2.partitions = [1]
      window2.frame(3)

      expect(window2).toStrictEqual(window1)
    })

    test('inequality with different ivars', () => {
      const window1 = new NamedWindow('foo')
      window1.orders = [1, 2]
      window1.partitions = [1]
      window1.frame(3)

      const window2 = new NamedWindow('bar')
      window2.orders = [1, 2]
      window2.partitions = [1]
      window2.frame(3)

      expect(window2).not.toStrictEqual(window1)
    })
  })
})
