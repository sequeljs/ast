import SQLString from '../collectors/SQLString'

import EngineNotSetError from '../errors/EngineNotSetError'
import VisitorNotSetError from '../errors/VisitorNotSetError'

import SequelAST from '../SequelAST'

import type Engine from '../interfaces/Engine'

import type FactoryMethods from '../mixins/FactoryMethods'

import type Statement from '../nodes/Statement'

class TreeManager<T extends Statement> {
  public readonly ast: T

  protected ctx: any = null

  constructor(ast: T) {
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

  where(expr: any): TreeManager<T> {
    this.ctx.wheres.push(expr)

    return this
  }
}

interface TreeManager<T extends Statement> extends FactoryMethods {}

export default TreeManager
