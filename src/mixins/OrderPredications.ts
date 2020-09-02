import Ascending from '../nodes/Ascending.js'
import Descending from '../nodes/Descending.js'

import type Visitable from '../visitors/Visitable.js'

export default abstract class OrderPredications {
  asc(this: Visitable): Ascending {
    return new Ascending(this)
  }

  desc(this: Visitable): Descending {
    return new Descending(this)
  }
}
