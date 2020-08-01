import Binary from './Binary'

export default class Equality<L = any, R = any> extends Binary<L, R> {
  public operator = '=='

  get operand1(): L {
    return this.left
  }

  get operand2(): R {
    return this.right
  }
}
