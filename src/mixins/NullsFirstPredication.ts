import NullsFirst from '../nodes/NullsFirst.js'

import type Visitable from '../visitors/Visitable.js'

export default abstract class NullsFirstPredication {
  nullsFirst(this: Visitable): NullsFirst {
    return new NullsFirst(this)
  }
}
