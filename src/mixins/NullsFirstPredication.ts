import NullsFirst from '../nodes/NullsFirst'

import type Visitable from '../visitors/Visitable'

export default abstract class NullsFirstPredication {
  nullsFirst(this: Visitable): NullsFirst {
    return new NullsFirst(this)
  }
}
