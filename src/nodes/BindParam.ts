import Node from './Node'

export default class BindParam extends Node {
  public value: any

  constructor(value: any) {
    super()

    this.value = value
  }
}
