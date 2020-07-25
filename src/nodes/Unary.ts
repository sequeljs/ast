import Node from './Node'

import type Visitable from '../visitors/Visitable'

export default class Unary<T = Visitable> extends Node {
  public expr: T

  get value(): T {
    return this.expr
  }

  constructor(expr: T) {
    super()

    this.expr = expr
  }
}
