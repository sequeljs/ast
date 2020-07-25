import '../helper'

import EngineNotSetError from '../../src/errors/EngineNotSetError'
import VisitorNotSetError from '../../src/errors/VisitorNotSetError'

import Node from '../../src/nodes/Node'

import SequelAST from '../../src/SequelAST'

describe('Not', () => {
  describe('toSQL', () => {
    test('throws when engine is null', () => {
      const node = new Node()

      expect(() => node.toSQL(null)).toThrow(EngineNotSetError)
    })

    test('throws when visitor is null', () => {
      const node = new Node()

      if (SequelAST.engine) {
        const oldVisitor = SequelAST.engine.connection.visitor
        SequelAST.engine.connection.visitor = null

        expect(() => node.toSQL(SequelAST.engine)).toThrow(VisitorNotSetError)

        SequelAST.engine.connection.visitor = oldVisitor
      }
    })
  })
})
