import '../helper.js'

import SQLString from '../../src/collectors/SQLString.js'

import SQLLiteral from '../../src/nodes/SQLLiteral.js'

import ToSQL from '../../src/visitors/ToSQL.js'
import Visitable from '../../src/visitors/Visitable.js'
import Visitor from '../../src/visitors/Visitor.js'

import SequelAST from '../../src/SequelAST.js'

const scope: { visitor: Visitor } = {
  visitor: new (class extends Visitor {})(),
}

function compile(node: Visitable): string {
  return scope.visitor.accept(node, new SQLString()).value
}

describe('SQLLiteral', () => {
  beforeEach(() => {
    if (SequelAST.engine) {
      scope.visitor = new ToSQL(SequelAST.engine.connection)
    }
  })

  describe('count', () => {
    test('makes a count node', () => {
      const node = new SQLLiteral('*').count()

      expect(compile(node)).toStrictEqual(`COUNT(*)`)
    })

    test('makes a distinct node', () => {
      const node = new SQLLiteral('*').count(true)

      expect(compile(node)).toStrictEqual(`COUNT(DISTINCT *)`)
    })
  })

  describe('equality', () => {
    test('makes an equality node', () => {
      const node = new SQLLiteral('foo').eq(1)

      expect(compile(node)).toStrictEqual('foo = 1')
    })

    test('equality with same ivars', () => {
      const array = [new SQLLiteral('foo'), new SQLLiteral('foo')]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new SQLLiteral('foo'), new SQLLiteral('bar')]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })

  describe('grouped "or" equality', () => {
    test('makes a grouping node with an or node', () => {
      const node = new SQLLiteral('foo').eqAny([1, 2])

      expect(compile(node)).toStrictEqual(`(foo = 1 OR foo = 2)`)
    })
  })

  describe('grouped "and" equality', () => {
    test('makes a grouping node with an and node', () => {
      const node = new SQLLiteral('foo').eqAll([1, 2])

      expect(compile(node)).toStrictEqual(`(foo = 1 AND foo = 2)`)
    })
  })
})
