import Binary from './Binary'

import type Relation from '../interfaces/Relation'

export default class DeleteStatement extends Binary {
  public limit: any

  get relation(): Relation {
    return this.left
  }

  set relation(val: Relation) {
    this.left = val
  }

  get wheres(): any[] {
    return this.right
  }

  set wheres(val: any[]) {
    this.right = val
  }

  constructor(relation: Relation | null = null, wheres: any[] = []) {
    super(relation, wheres)
  }
}
