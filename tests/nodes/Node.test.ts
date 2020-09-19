import '../helper.js'

import EngineNotSetError from '../../src/errors/EngineNotSetError.js'
import VisitorNotSetError from '../../src/errors/VisitorNotSetError.js'

import Node from '../../src/nodes/Node.js'

import SequelAST from '../../src/SequelAST.js'

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
