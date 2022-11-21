import '../helper'

import NamedSQLFunction from '../../src/nodes/NamedSQLFunction'
import SQLLiteral from '../../src/nodes/SQLLiteral'

describe('NamedSQLFunction', () => {
  test('construct', () => {
    const sqlFunction = new NamedSQLFunction('omg', 'zomg')

    expect(sqlFunction.name).toStrictEqual('omg')
    expect(sqlFunction.expressions).toStrictEqual('zomg')
  })

  test('function alias', () => {
    let sqlFunction = new NamedSQLFunction('omg', 'zomg')
    sqlFunction = sqlFunction.as('wth')

    expect(sqlFunction.name).toStrictEqual('omg')
    expect(sqlFunction.expressions).toStrictEqual('zomg')
    expect(sqlFunction.alias).toStrictEqual(new SQLLiteral('wth'))
  })

  test('construct with alias', () => {
    const sqlFunction = new NamedSQLFunction('omg', 'zomg', 'wth')

    expect(sqlFunction.name).toStrictEqual('omg')
    expect(sqlFunction.expressions).toStrictEqual('zomg')
    expect(sqlFunction.alias).toStrictEqual(new SQLLiteral('wth'))
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [
        new NamedSQLFunction('omg', 'zomg', 'wth'),
        new NamedSQLFunction('omg', 'zomg', 'wth'),
      ]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [
        new NamedSQLFunction('omg', 'zomg', 'wth'),
        new NamedSQLFunction('zomg', 'zomg', 'wth'),
      ]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
