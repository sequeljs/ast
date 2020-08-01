import Assignment from '../nodes/Assignment'
import SQLLiteral from '../nodes/SQLLiteral'
import UnqualifiedColumn from '../nodes/UnqualifiedColumn'
import UpdateStatement from '../nodes/UpdateStatement'

import TreeManager from './TreeManager'

import type StatementMethods from '../mixins/StatementMethods'

class UpdateManager extends TreeManager<UpdateManager, UpdateStatement> {
  protected ctx: UpdateStatement

  constructor() {
    super(new UpdateStatement())

    this.ctx = this.ast
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
}

interface UpdateManager extends StatementMethods<UpdateStatement> {}

export default UpdateManager
