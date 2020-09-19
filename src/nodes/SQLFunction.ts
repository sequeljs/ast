import NodeExpression from './NodeExpression.js'
import SQLLiteral from './SQLLiteral.js'

import type WindowPredication from '../mixins/WindowPredication.js'

class SQLFunction extends NodeExpression {
  public alias: SQLLiteral | null = null

  public distinct: boolean | null

  public expressions: any

  constructor(expr: any, aliaz: string | SQLLiteral | null = null) {
    super()

    if (aliaz) {
      this.alias = new SQLLiteral(aliaz)
    }
    this.distinct = false
    this.expressions = expr
  }

  as(aliaz: any): SQLFunction {
    this.alias = new SQLLiteral(aliaz)

    return this
  }
}

interface SQLFunction extends WindowPredication {}

export default SQLFunction
