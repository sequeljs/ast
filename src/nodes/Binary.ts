import Node from './Node'

export default class Binary<L = any, R = any> extends Node {
  public left: L

  public right: R

  constructor(left: L, right: R) {
    super()

    this.left = left
    this.right = right
  }
}
