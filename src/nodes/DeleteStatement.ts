import Node from './Node.js'

import type Relation from '../interfaces/Relation.js'

import type JoinSource from './JoinSource.js'
import type SQLLiteral from './SQLLiteral.js'

export default class DeleteStatement extends Node {
  public key: any = null

  public limit: any = null

  public offset: any = null

  public orders: any[] = []

  public left: JoinSource | Relation | SQLLiteral | null = null

  public right: any[] = []

  get relation(): JoinSource | Relation | SQLLiteral | null {
    return this.left
  }

  set relation(val: JoinSource | Relation | SQLLiteral | null) {
    this.left = val
  }

  get wheres(): any[] {
    return this.right
  }

  set wheres(val: any[]) {
    this.right = val
  }

  constructor(
    relation: JoinSource | Relation | SQLLiteral | null = null,
    wheres: any[] = [],
  ) {
    super()

    this.left = relation
    this.right = wheres
  }
}
