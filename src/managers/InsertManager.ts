import InsertStatement from '../nodes/InsertStatement'
import SQLLiteral from '../nodes/SQLLiteral'
import ValuesList from '../nodes/ValuesList'

import TreeManager from './TreeManager'

import type Table from '../Table'

export default class InsertManager extends TreeManager<
  InsertManager,
  InsertStatement
> {
  protected ctx: InsertStatement

  get columns(): InsertManager['ctx']['columns'] {
    return this.ast.columns
  }

  set values(val: InsertManager['ctx']['values']) {
    this.ast.values = val
  }

  constructor() {
    super(new InsertStatement())

    this.ctx = this.ast
  }

  createValues(values: any): ValuesList {
    return new ValuesList([values])
  }

  createValuesList(rows: any[]): ValuesList {
    return new ValuesList(rows)
  }

  insert(fields: any): InsertManager {
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      return this
    }

    if (typeof fields === 'string') {
      this.ast.values = new SQLLiteral(fields)
    } else {
      if (!this.ast.relation) {
        this.ast.relation = fields[0][0].relation
      }

      const values: any[] = []
      fields.forEach(([column, value]: [any, any]) => {
        this.ast.columns.push(column)
        values.push(value)
      })

      this.ast.values = this.createValues(values)
    }

    return this
  }

  into(table: Table): InsertManager {
    this.ctx.relation = table

    return this
  }

  select(select: any): void {
    this.ast.select = select
  }
}
