import Binary from './Binary'

import type Visitable from '../visitors/Visitable'

export default class Values extends Binary<Visitable[], Visitable[]> {
  get expressions(): Visitable[] {
    return this.left
  }

  set expressions(val: Visitable[]) {
    this.left = val
  }

  get columns(): Visitable[] {
    return this.right
  }

  set columns(val: Visitable[]) {
    this.right = val
  }

  constructor(exprs: Visitable[], columns: Visitable[] = []) {
    super(exprs, columns)
  }
}
