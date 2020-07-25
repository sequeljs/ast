import SQLFunction from './SQLFunction'

import type Math from '../mixins/Math'

class Count extends SQLFunction {
  constructor(expr: any, distinct: boolean | null = false, aliaz: any = null) {
    super(expr, aliaz)

    this.distinct = distinct
  }
}

interface Count extends Math {}

export default Count
