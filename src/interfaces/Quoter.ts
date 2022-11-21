import type SQLLiteral from '../nodes/SQLLiteral'

import type Visitable from '../visitors/Visitable'

export default interface Quoter {
  quote(value: Visitable): number | string

  quoteColumnName(value: number | string | SQLLiteral): string

  quoteTableName(value: number | string | SQLLiteral): string
}
