import SQLString from '../collectors/SQLString'

import EngineNotSetError from '../errors/EngineNotSetError'
import VisitorNotSetError from '../errors/VisitorNotSetError'

import SequelAST from '../SequelAST'

import type Engine from '../interfaces/Engine'

import type FactoryMethods from '../mixins/FactoryMethods'
import type NodeMethods from '../mixins/NodeMethods'

class Node {
  private readonly __sequelASTUnquotable = true

  toSQL(engine: Engine | null = SequelAST.engine): any {
    if (!engine) {
      throw new EngineNotSetError()
    }

    if (!engine.connection.visitor) {
      throw new VisitorNotSetError()
    }

    let collector: SQLString

    collector = new SQLString()

    collector = engine.connection.visitor.accept(this, collector)

    return collector.value
  }
}

interface Node extends FactoryMethods, NodeMethods {}

export default Node
