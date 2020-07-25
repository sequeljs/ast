import Assignment from '../nodes/Assignment'
import Limit from '../nodes/Limit'
import UnqualifiedColumn from '../nodes/UnqualifiedColumn'
import UpdateStatement from '../nodes/UpdateStatement'
import buildQuoted from '../nodes/buildQuoted'

import TreeManager from './TreeManager'
import { SQLLiteral } from '../nodes/mod'

export default class UpdateManager extends TreeManager<UpdateStatement> {
  protected ctx: UpdateStatement

  get key(): UpdateStatement['key'] {
    return this.ast.key
  }

  set key(key: any) {
    this.ast.key = buildQuoted(key)
  }

  set wheres(exprs: UpdateStatement['wheres']) {
    this.ast.wheres = exprs
  }

  constructor() {
    super(new UpdateStatement())

    this.ctx = this.ast
  }

  order(...expr: UpdateStatement['orders']): UpdateManager {
    this.ast.orders = expr

    return this
  }

  set(values: any): UpdateManager {
    if (
      typeof values === 'string' ||
      (values && values instanceof SQLLiteral)
    ) {
      this.ast.values = [values]
    } else {
      this.ast.values = values.map(([column, value]: [any, any]) => {
        return new Assignment(new UnqualifiedColumn(column), value)
      })
    }

    return this
  }

  table(table: UpdateStatement['relation']): UpdateManager {
    this.ast.relation = table

    return this
  }

  take(limit: any): UpdateManager {
    if (limit) {
      this.ast.limit = new Limit(buildQuoted(limit))
    }

    return this
  }

  where(expr: UpdateStatement['where']): UpdateManager {
    this.ast.wheres.push(expr)

    return this
  }
}
