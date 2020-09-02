import NullsLast from '../nodes/NullsLast.js'

import type Visitable from '../visitors/Visitable.js'

export default abstract class NullsLastPredication {
  nullsLast(this: Visitable): NullsLast {
    return new NullsLast(this)
  }
}
