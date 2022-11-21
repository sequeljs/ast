import '../helper'

import SQLString from '../../src/collectors/SQLString'

import Bin from '../../src/nodes/Bin'
import SQLLiteral from '../../src/nodes/SQLLiteral'

import MySQL from '../../src/visitors/MySQL'
import ToSQL from '../../src/visitors/ToSQL'

import FakeRecord from '../support/FakeRecord'

const engine = new FakeRecord()

describe('Bin', () => {
  test('construct', () => {
    const bin = new Bin('zomg')

    expect(bin.expr).toStrictEqual('zomg')
  })

  test('default toSQL', () => {
    const visitor = new ToSQL(engine.connection)

    const node = new Bin(new SQLLiteral('zomg'))

    expect(visitor.accept(node, new SQLString()).value).toStrictEqual('zomg')
  })

  test('MySQL toSQL', () => {
    const visitor = new MySQL(engine.connection)

    const node = new Bin(new SQLLiteral('zomg'))

    expect(visitor.accept(node, new SQLString()).value).toStrictEqual(
      'BINARY zomg',
    )
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Bin('zomg'), new Bin('zomg')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Bin('zomg'), new Bin('zomg!')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
