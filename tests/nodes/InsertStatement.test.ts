import '../helper.js'

import InsertStatement from '../../src/nodes/InsertStatement.js'

import Table from '../../src/Table.js'

describe('InsertStatement', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const table = new Table('users')

      const statement1 = new InsertStatement()
      statement1.columns = [table.get('a'), table.get('b'), table.get('c')]
      statement1.values = ['x', 'y', 'z']

      const statement2 = new InsertStatement()
      statement2.columns = [table.get('a'), table.get('b'), table.get('c')]
      statement2.values = ['x', 'y', 'z']

      expect(statement2).toStrictEqual(statement1)
    })

    test('inequality with different ivars', () => {
      const table = new Table('users')

      const statement1 = new InsertStatement()
      statement1.columns = [table.get('a'), table.get('b'), table.get('c')]
      statement1.values = ['x', 'y', 'z']

      const statement2 = new InsertStatement()
      statement2.columns = [table.get('a'), table.get('b'), table.get('c')]
      statement2.values = ['1', '2', '3']

      expect(statement2).not.toStrictEqual(statement1)
    })
  })
})
