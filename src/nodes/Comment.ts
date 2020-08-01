import Node from './Node'

export default class Comment extends Node {
  public readonly values: any[]

  constructor(values: any[]) {
    super()

    this.values = values
  }
}
