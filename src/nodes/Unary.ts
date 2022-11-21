import NodeExpression from './NodeExpression'

import type AliasPredication from '../mixins/AliasPredication'

import type Visitable from '../visitors/Visitable'

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
