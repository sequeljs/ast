import type SQLLiteral from '../nodes/SQLLiteral'

import type Visitable from '../visitors/Visitable'

export default interface TypeCaster {
  isAbleToTypeCast(): boolean

  typeCastForDatabase(
    attributeName: string | SQLLiteral,
    value: Visitable,
  ): number | string
}
