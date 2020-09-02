import NodeExpression from './NodeExpression.js'

import type Attribute from '../attributes/Attribute.js'

import type AliasPredication from '../mixins/AliasPredication.js'

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
