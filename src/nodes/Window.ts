import Node from './Node'
import Range from './Range'
import Rows from './Rows'
import SQLLiteral from './SQLLiteral'

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
