import SQLString from '../collectors/SQLString'

import EngineNotSetError from '../errors/EngineNotSetError'
import VisitorNotSetError from '../errors/VisitorNotSetError'

import SequelAST from '../SequelAST'

import type Engine from '../interfaces/Engine'

import type FactoryMethods from '../mixins/FactoryMethods'

import type Statement from '../nodes/Statement'

abstract class TreeManager<M extends TreeManager<M, S>, S extends Statement> {
  public readonly ast: S

  protected ctx: any = null

  constructor(ast: S) {
    this.ast = ast
  }

  toSQL(engine: Engine | null | undefined = undefined): string | null {
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

    collector = currentEngine.connection.visitor.accept(
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
