import SQLString from '../collectors/SQLString.js'

import EngineNotSetError from '../errors/EngineNotSetError.js'
import VisitorNotSetError from '../errors/VisitorNotSetError.js'

import SequelAST from '../SequelAST.js'

import type Engine from '../interfaces/Engine.js'

import type FactoryMethods from '../mixins/FactoryMethods.js'

import type Statement from '../nodes/Statement.js'

abstract class TreeManager<M extends TreeManager<M, S>, S extends Statement> {
  public readonly ast: S

  protected ctx: any = null

  constructor(ast: S) {
    this.ast = ast
  }

  toSQL(engine: Engine | null = SequelAST.engine): string | null {
    if (!engine) {
      throw new EngineNotSetError()
    }

    if (!engine.connection.visitor) {
      throw new VisitorNotSetError()
    }

    let collector: SQLString

    collector = new SQLString()

    collector = engine.connection.visitor.accept(
      this.ast,
      collector,
    ) as SQLString

    return collector.value
  }

  where(this: M, expr: any): M {
    this.ctx.wheres.push(expr)

    return this
  }
}

interface TreeManager<M extends TreeManager<M, S>, S extends Statement>
  extends FactoryMethods {}

export default TreeManager
