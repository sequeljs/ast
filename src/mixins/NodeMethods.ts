import And from '../nodes/And'
import Grouping from '../nodes/Grouping'
import Not from '../nodes/Not'
import Or from '../nodes/Or'

import type Node from '../nodes/Node'

import type Visitable from '../visitors/Visitable'

export default abstract class NodeMethods {
  and(right: any): And {
    return new And([this, right])
  }

  not(this: Node): Not {
    return new Not(this)
  }

  or<T extends Visitable>(right: T): Grouping {
    return new Grouping(new Or(this, right))
  }
}
