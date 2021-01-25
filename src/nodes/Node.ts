import SQLString from '../collectors/SQLString.js'

import EngineNotSetError from '../errors/EngineNotSetError.js'
import VisitorNotSetError from '../errors/VisitorNotSetError.js'

import SequelAST from '../SequelAST.js'

import type Engine from '../interfaces/Engine.js'

import type FactoryMethods from '../mixins/FactoryMethods.js'
import type NodeMethods from '../mixins/NodeMethods.js'

class Node {
  private readonly __sequelASTUnquotable = true

  toSQL(engine: Engine | null | undefined = undefined): any {
    let currentEngine = engine
    if (typeof currentEngine === 'undefined') {
      currentEngine = SequelAST.engine
    }

    if (!currentEngine) {
      throw new EngineNotSetError()
    }

    if (!currentEngine.connection.visitor) {
      throw new VisitorNotSetError()
    }

    let collector: SQLString

    collector = new SQLString()

    collector = currentEngine.connection.visitor.accept(this, collector)

    return collector.value
  }
}

interface Node extends FactoryMethods, NodeMethods {}

export default Node
