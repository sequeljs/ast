import Unary from './Unary'

import type Attribute from '../attributes/Attribute'

export default class UnaryOperation extends Unary {
  public readonly operator: string

  constructor(operator: string, operand: number | string | Attribute) {
    super(operand)

    this.operator = operator
  }
}
