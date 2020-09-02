import Limit from '../nodes/Limit.js'
import Offset from '../nodes/Offset.js'
import buildQuoted from '../nodes/buildQuoted.js'

import type DeleteStatement from '../nodes/DeleteStatement.js'
import type UpdateStatement from '../nodes/UpdateStatement.js'

export default abstract class StatementMethods<
  S extends DeleteStatement | UpdateStatement
> {
  public abstract readonly ast: S

  get key(): any {
    return this.ast.key
  }

  set key(val: any) {
    this.ast.key = buildQuoted(val)
  }

  set wheres(val: S['wheres']) {
    this.ast.wheres = val
  }

  offset(offset: any): StatementMethods<S> {
    if (offset) {
      this.ast.offset = new Offset(buildQuoted(offset))
    }

    return this
  }

  order(...expr: S['orders']): StatementMethods<S> {
    this.ast.orders = expr

    return this
  }

  take(limit: any): StatementMethods<S> {
    if (limit) {
      this.ast.limit = new Limit(buildQuoted(limit))
    }

    return this
  }
}
