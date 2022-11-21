import NodeExpression from './NodeExpression'

import type AliasPredication from '../mixins/AliasPredication'

class And extends NodeExpression {
  public readonly children: any[]

  get left(): any {
    return this.children[0]
  }

  get right(): any {
    return this.children[1]
  }

  constructor(children: any[]) {
    super()

    this.children = children
  }
}

interface And extends AliasPredication {}

export default And
