import '../helper'

import TableAlias from '../../src/nodes/TableAlias'

import Table from '../../src/Table'

describe('TableAlias', () => {
  test('should alias name', () => {
    const relation = new Table('users')

    const node = new TableAlias(relation, 'foo')
    node.name = 'bar'

    expect(node.right).toStrictEqual('bar')
  })

  test('should alias relation', () => {
    const relation1 = new Table('foo')
    const relation2 = new Table('bar')

    const node = new TableAlias(relation1, 'users')
    node.relation = relation2

    expect(node.left).toStrictEqual(relation2)
  })

  test('should accept tableAlias', () => {
    const relation = new Table('users')

    const node = new TableAlias(relation, 'foo')
    node.tableAlias = 'bar'

    expect(node.name).toStrictEqual('bar')
  })

  test('should respond to tableName', () => {
    const relation = new Table('users')

    const node1 = new TableAlias(relation, 'foo')

    expect(node1.tableName).toStrictEqual('users')

    const node2 = new TableAlias('users', 'foo')

    expect(node2.tableName).toStrictEqual('foo')
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const relation1 = new Table('users')
      const node1 = new TableAlias(relation1, 'foo')

      const relation2 = new Table('users')
      const node2 = new TableAlias(relation2, 'foo')

      const array = [node1, node2]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const relation1 = new Table('users')
      const node1 = new TableAlias(relation1, 'foo')

      const relation2 = new Table('users')
      const node2 = new TableAlias(relation2, 'bar')

      const array = [node1, node2]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
