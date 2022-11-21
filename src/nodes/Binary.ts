import NodeExpression from './NodeExpression'

import type AliasPredication from '../mixins/AliasPredication'

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
