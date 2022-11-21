import NullsLast from '../nodes/NullsLast'

import type Visitable from '../visitors/Visitable'

export default abstract class NullsLastPredication {
  nullsLast(this: Visitable): NullsLast {
    return new NullsLast(this)
  }
}
