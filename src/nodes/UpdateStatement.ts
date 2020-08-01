import Node from './Node'

import type Relation from '../interfaces/Relation'

import type JoinSource from './JoinSource'
import type SQLLiteral from './SQLLiteral'

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
