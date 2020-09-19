import Unary from './Unary.js'

import type ValuesListRow from './ValuesListRow.js'

export default class ValuesList extends Unary<ValuesListRow[]> {
  get rows(): Unary<ValuesListRow[]>['expr'] {
    return this.expr
  }
}
