import type SQLLiteral from '../nodes/SQLLiteral.js'

import type Visitable from '../visitors/Visitable.js'

export default interface Quoter {
  quote(value: Visitable): number | string

  quoteColumnName(value: number | string | SQLLiteral): string

  quoteTableName(value: number | string | SQLLiteral): string
}
