import '../helper'

import SQLLiteral from '../../src/nodes/SQLLiteral'
import UpdateStatement from '../../src/nodes/UpdateStatement'

describe('UpdateStatement', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const statement1 = new UpdateStatement()
      statement1.relation = new SQLLiteral('zomg')
      statement1.where = 2
      statement1.value = false
      statement1.orders = ['x', 'y', 'z']
      statement1.limit = 42
      statement1.key = 'zomg'

      const statement2 = new UpdateStatement()
      statement2.relation = new SQLLiteral('zomg')
      statement2.where = 2
      statement2.value = false
      statement2.orders = ['x', 'y', 'z']
      statement2.limit = 42
      statement2.key = 'zomg'

      expect(statement2).toStrictEqual(statement1)
    })

    test('inequality with different ivars', () => {
      const statement1 = new UpdateStatement()
      statement1.relation = new SQLLiteral('zomg')
      statement1.where = 2
      statement1.value = false
      statement1.orders = ['x', 'y', 'z']
      statement1.limit = 42
      statement1.key = 'zomg'

      const statement2 = new UpdateStatement()
      statement2.relation = new SQLLiteral('zomg')
      statement2.where = 2
      statement2.value = false
      statement2.orders = ['x', 'y', 'z']
      statement2.limit = 42
      statement2.key = 'wth'

      expect(statement2).not.toStrictEqual(statement1)
    })
  })
})
