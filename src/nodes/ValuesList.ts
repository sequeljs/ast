import Node from './Node'

import type BindParam from './BindParam'
import type SQLLiteral from './SQLLiteral'

type Row = {
  [k: string]: number | string | BindParam | SQLLiteral
}

export default class ValuesList extends Node {
  public readonly rows: Row[]

  constructor(rows: Row[]) {
    super()

    this.rows = rows
  }
}
