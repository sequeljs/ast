import Binary from './Binary'

export default class Equality extends Binary {
  public operator = '=='

  get operand1(): any {
    return this.left
  }

  get operand2(): any {
    return this.right
  }
}
