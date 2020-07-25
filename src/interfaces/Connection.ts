import type Visitor from '../visitors/Visitor'

import type Quoter from './Quoter'

export default interface Connection extends Quoter {
  visitor: Visitor | null
}
