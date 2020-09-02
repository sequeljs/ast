import DeleteStatement from '../nodes/DeleteStatement.js'

import TreeManager from './TreeManager.js'

import type Relation from '../interfaces/Relation.js'

import type StatementMethods from '../mixins/StatementMethods.js'

import type JoinSource from '../nodes/JoinSource.js'
import type SQLLiteral from '../nodes/SQLLiteral.js'

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
