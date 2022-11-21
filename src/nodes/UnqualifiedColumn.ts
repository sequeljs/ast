import Unary from './Unary'

import type Attribute from '../attributes/Attribute'

export default class UnqualifiedColumn extends Unary<Attribute> {
  get attribute(): this['expr'] {
    return this.expr
  }

  set attribute(val: this['expr']) {
    this.expr = val
  }

  get column(): this['name'] {
    return this.name
  }

  get name(): Attribute['name'] {
    return this.expr.name
  }

  get relation(): Attribute['relation'] {
    return this.expr.relation
  }

  constructor(expr: Attribute) {
    super(expr)

    this.expr = expr
  }
}
