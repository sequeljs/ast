import SelectManager from '../managers/SelectManager.js'

import InnerJoin from '../nodes/InnerJoin.js'
import Join from '../nodes/Join.js'
import OuterJoin from '../nodes/OuterJoin.js'
import SQLLiteral from '../nodes/SQLLiteral.js'

import type Attribute from '../attributes/Attribute.js'

import type Relation from '../interfaces/Relation.js'

export default abstract class SelectPredications {
  from(): SelectManager {
    return new SelectManager(this)
  }

  group(...columns: (string | Attribute)[]): SelectManager {
    return this.from().group(...columns)
  }

  having(expr: any): SelectManager {
    return this.from().having(expr)
  }

  join(
    relation: string | Relation | SQLLiteral | null,
    klass: typeof Join = InnerJoin,
  ): SelectManager {
    return this.from().join(relation, klass)
  }

  order(...expr: any[]): SelectManager {
    return this.from().order(...expr)
  }

  outerJoin(relation: string | Relation | SQLLiteral | null): SelectManager {
    return this.join(relation, OuterJoin)
  }

  project(...things: any[]): SelectManager {
    return this.from().project(...things)
  }

  skip(amount: any): SelectManager {
    return this.from().skip(amount)
  }

  take(amount: any): SelectManager {
    return this.from().take(amount)
  }

  where(condition: any): SelectManager {
    return this.from().where(condition) as SelectManager
  }
}
