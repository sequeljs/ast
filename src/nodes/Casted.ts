import NodeExpression from './NodeExpression'

import type Attribute from '../attributes/Attribute'

import type AliasPredication from '../mixins/AliasPredication'

class Casted extends NodeExpression {
  public readonly attribute: string | Attribute

  public readonly value: any

  constructor(value: any, attribute: string | Attribute) {
    super()

    this.attribute = attribute
    this.value = value
  }
}

interface Casted extends AliasPredication {}

export default Casted
