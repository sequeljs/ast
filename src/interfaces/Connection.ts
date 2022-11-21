import type Visitor from '../visitors/Visitor'

import type Quoter from './Quoter'

export default interface Connection extends Quoter {
  inClauseLength: number | null

  visitor: Visitor | null

  sanitizeAsSQLComment(value: any): string
}
