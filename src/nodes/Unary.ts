import NodeExpression from './NodeExpression.js'

import type AliasPredication from '../mixins/AliasPredication.js'

import type Visitable from '../visitors/Visitable.js'

class Unary<T = Visitable> extends NodeExpression {
  public expr: T

  get value(): T {
    return this.expr
  }

  constructor(expr: T) {
    super()

    this.expr = expr
  }
}

interface Unary extends AliasPredication {}

export default Unary
