import And from '../nodes/And.js'
import Grouping from '../nodes/Grouping.js'
import Not from '../nodes/Not.js'
import Or from '../nodes/Or.js'

import type Node from '../nodes/Node.js'

import type Visitable from '../visitors/Visitable.js'

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
