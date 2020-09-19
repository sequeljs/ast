import NodeExpression from './NodeExpression.js'

import type AliasPredication from '../mixins/AliasPredication.js'

class Binary<L = any, R = any> extends NodeExpression {
  public left: L

  public right: R

  constructor(left: L, right: R) {
    super()

    this.left = left
    this.right = right
  }
}

interface Binary extends AliasPredication {}

export default Binary
