import DeleteStatement from '../nodes/DeleteStatement'
import Limit from '../nodes/Limit'
import buildQuoted from '../nodes/buildQuoted'

import TreeManager from './TreeManager'

import type Relation from '../interfaces/Relation'

export default class DeleteManager extends TreeManager<DeleteStatement> {
  public ctx: DeleteStatement

  set wheres(list: any[]) {
    this.ctx.wheres = list
  }

  constructor() {
    super(new DeleteStatement())

    this.ctx = this.ast
  }

  from(relation: Relation): DeleteManager {
    this.ctx.relation = relation

    return this
  }

  take(limit: any): DeleteManager {
    if (limit) {
      this.ctx.limit = new Limit(buildQuoted(limit))
    }

    return this
  }
}
