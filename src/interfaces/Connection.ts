import type Visitor from '../visitors/Visitor.js'

import type Quoter from './Quoter.js'

export default interface Connection extends Quoter {
  inClauseLength: number | null

  visitor: Visitor | null

  sanitizeAsSQLComment(value: any): string
}
