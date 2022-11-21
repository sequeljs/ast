import DeleteStatement from '../nodes/DeleteStatement'

import TreeManager from './TreeManager'

import type Relation from '../interfaces/Relation'

import type StatementMethods from '../mixins/StatementMethods'

import type JoinSource from '../nodes/JoinSource'
import type SQLLiteral from '../nodes/SQLLiteral'

class DeleteManager extends TreeManager<DeleteManager, DeleteStatement> {
  public ctx: DeleteStatement

  constructor() {
    super(new DeleteStatement())

    this.ctx = this.ast
  }

  from(relation: JoinSource | Relation | SQLLiteral): DeleteManager {
    this.ctx.relation = relation

    return this
  }
}

interface DeleteManager extends StatementMethods<DeleteStatement> {}

export default DeleteManager
