import Node from './Node.js'

import type Relation from '../interfaces/Relation.js'

import type JoinSource from './JoinSource.js'
import type SQLLiteral from './SQLLiteral.js'

export default class UpdateStatement extends Node {
  public key: any = null

  public limit: any = null

  public offset: any = null

  public orders: any[] = []

  public relation: JoinSource | Relation | SQLLiteral | null = null

  public values: any[] = []

  public wheres: any[] = []

  set value(expr: any) {
    this.values.push(expr)
  }

  set where(expr: any) {
    this.wheres.push(expr)
  }
}
