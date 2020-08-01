import '../helper'

import Equality from '../../src/nodes/Equality'

import ToSQL from '../../src/visitors/ToSQL'

import Table from '../../src/Table'

import type Engine from '../../src/interfaces/Engine'

import { quote, quoteColumnName, quoteTableName } from '../support/quote'

describe('Equality', () => {
  describe('backwards compat', () => {
    describe('operator', () => {
      test('returns ==', () => {
        const attribute = new Table('users').get('id')

        const left = attribute.eq(10)

        expect(left.operator).toStrictEqual('==')
      })
    })

    describe('operand1', () => {
      test('should equal left', () => {
        const attribute = new Table('users').get('id')

        const left = attribute.eq(10)

        expect(left.operand1).toStrictEqual(left.left)
      })
    })

    describe('operand2', () => {
      test('should equal left', () => {
        const attribute = new Table('users').get('id')

        const left = attribute.eq(10)

        expect(left.operand2).toStrictEqual(left.right)
      })
    })

    describe('toSQL', () => {
      test('takes an engine', () => {
        let quoteCount = 0

        const engine: Engine = {
          connection: {
            inClauseLength: 2,
            visitor: null,
            quote(value: number | string): number | string {
              quoteCount += 1
              return quote(value)
            },
            quoteColumnName(value: string): string {
              quoteCount += 1
              return quoteColumnName(value)
            },
            quoteTableName(value: string): string {
              quoteCount += 1
              return quoteTableName(value)
            },
            sanitizeAsSQLComment(value: any) {
              return value
            },
          },
        }
        engine.connection.visitor = new ToSQL(engine.connection)

        const attribute = new Table('users').get('id')
        const test = attribute.eq(10)
        test.toSQL(engine)

        expect(quoteCount).toStrictEqual(3)
      })
    })

    describe('or', () => {
      test('makes an OR node', () => {
        const attribute = new Table('users').get('id')

        const left = attribute.eq(10)
        const right = attribute.eq(11)

        const node = left.or(right)

        expect((node.expr as Equality).left).toStrictEqual(left)
        expect((node.expr as Equality).right).toStrictEqual(right)
      })
    })

    describe('and', () => {
      test('makes and AND node', () => {
        const attribute = new Table('users').get('id')

        const left = attribute.eq(10)
        const right = attribute.eq(11)

        const node = left.and(right)

        expect(node.left).toStrictEqual(left)
        expect(node.right).toStrictEqual(right)
      })
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Equality('foo', 'bar'), new Equality('foo', 'bar')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new Equality('foo', 'bar'), new Equality('foo', 'baz')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
