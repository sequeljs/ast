import Unary from './Unary.js'

import type Attribute from '../attributes/Attribute.js'

export default class UnaryOperation extends Unary {
  public readonly operator: string

  constructor(operator: string, operand: number | string | Attribute) {
    super(operand)

    this.operator = operator
  }
}
