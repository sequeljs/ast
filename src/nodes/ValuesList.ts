import Unary from './Unary'

import type ValuesListRow from './ValuesListRow'

export default class ValuesList extends Unary<ValuesListRow[]> {
  get rows(): Unary<ValuesListRow[]>['expr'] {
    return this.expr
  }
}
