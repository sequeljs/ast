import Node from './Node'
import SQLLiteral from './SQLLiteral'

import type ConcatPredication from '../mixins/ConcatPredication'
import type OrderPredications from '../mixins/OrderPredications'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'
import type WindowPredication from '../mixins/WindowPredication'

class SQLFunction extends Node {
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

interface SQLFunction
  extends ConcatPredication,
    OrderPredications,
    Predications,
    WhenPredication,
    WindowPredication {}

export default SQLFunction
