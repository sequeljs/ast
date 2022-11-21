import SQLString from '../collectors/SQLString'

import EngineNotSetError from '../errors/EngineNotSetError'
import VisitorNotSetError from '../errors/VisitorNotSetError'

import SequelAST from '../SequelAST'

import type Engine from '../interfaces/Engine'

import type FactoryMethods from '../mixins/FactoryMethods'
import type NodeMethods from '../mixins/NodeMethods'

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
