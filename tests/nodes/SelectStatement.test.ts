import '../helper.js'

import SelectStatement from '../../src/nodes/SelectStatement.js'

describe('SelectStatement', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const statement1 = new SelectStatement()
      statement1.offset = 1
      statement1.limit = 2
      statement1.lock = false
      statement1.orders = ['x', 'y', 'z']
      statement1.with = 'zomg'

      const statement2 = new SelectStatement()
      statement2.offset = 1
      statement2.limit = 2
      statement2.lock = false
      statement2.orders = ['x', 'y', 'z']
      statement2.with = 'zomg'

      expect(statement2).toStrictEqual(statement1)
    })

    test('inequality with different ivars', () => {
      const statement1 = new SelectStatement()
      statement1.offset = 1
      statement1.limit = 2
      statement1.lock = false
      statement1.orders = ['x', 'y', 'z']
      statement1.with = 'zomg'

      const statement2 = new SelectStatement()
      statement2.offset = 1
      statement2.limit = 2
      statement2.lock = false
      statement2.orders = ['x', 'y', 'z']
      statement2.with = 'wth'

      expect(statement2).not.toStrictEqual(statement1)
    })
  })
})
