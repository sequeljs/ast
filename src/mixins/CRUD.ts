import DeleteManager from '../managers/DeleteManager'
import InsertManager from '../managers/InsertManager'
import UpdateManager from '../managers/UpdateManager'

import SQLLiteral from '../nodes/SQLLiteral'

import type SelectCore from '../nodes/SelectCore'
import type SelectStatement from '../nodes/SelectStatement'

export default abstract class CRUD {
  public abstract readonly ast: SelectStatement

  protected abstract ctx: SelectCore

  compileUpdate(values: any, pk: any): UpdateManager {
    const um = new UpdateManager()

    let relation
    if (values instanceof SQLLiteral) {
      relation = this.ctx.from
    } else {
      relation = values[0][0].relation
    }

    um.key = pk
    um.table(relation)
    um.set(values)
    if (this.ast.limit) {
      um.take(this.ast.limit.expr)
    }
    um.order(...this.ast.orders)
    um.wheres = this.ctx.wheres

    return um
  }

  compileInsert(values: any): InsertManager {
    const im = this.createInsert()

    im.insert(values)

    return im
  }

  createInsert(): InsertManager {
    return new InsertManager()
  }

  compileDelete(): DeleteManager {
    const dm = new DeleteManager()

    if (this.ast.limit) {
      dm.take(this.ast.limit.expr)
    }
    dm.wheres = this.ctx.wheres
    dm.from(this.ctx.froms)

    return dm
  }
}
