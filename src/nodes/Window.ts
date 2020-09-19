import Node from './Node.js'
import Range from './Range.js'
import Rows from './Rows.js'
import SQLLiteral from './SQLLiteral.js'

export default class Window extends Node {
  public framing: any = null

  public orders: any[] = []

  public partitions: any[] = []

  frame(expr: any): any {
    this.framing = expr

    return this.framing
  }

  order(...expr: any[]): Window {
    this.orders.push(
      ...expr.map((x) => (typeof x === 'string' ? new SQLLiteral(x) : x)),
    )

    return this
  }

  partition(...expr: any[]): Window {
    this.partitions.push(
      ...expr.map((x) => (typeof x === 'string' ? new SQLLiteral(x) : x)),
    )

    return this
  }

  range(expr: any = null): Range {
    const range = new Range(expr)

    if (!this.framing) {
      this.frame(range)
    }

    return range
  }

  rows(expr: any = null): Rows {
    const rows = new Rows(expr)

    if (!this.framing) {
      this.frame(rows)
    }

    return rows
  }
}
