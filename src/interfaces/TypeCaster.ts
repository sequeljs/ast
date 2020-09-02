import type SQLLiteral from '../nodes/SQLLiteral.js'

import type Visitable from '../visitors/Visitable.js'

export default interface TypeCaster {
  isAbleToTypeCast(): boolean

  typeCastForDatabase(
    attributeName: string | SQLLiteral,
    value: Visitable,
  ): number | string
}
