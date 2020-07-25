import Ascending from '../nodes/Ascending'
import Descending from '../nodes/Descending'

import type Visitable from '../visitors/Visitable'

export default abstract class OrderPredications {
  asc(this: Visitable): Ascending {
    return new Ascending(this)
  }

  desc(this: Visitable): Descending {
    return new Descending(this)
  }
}
