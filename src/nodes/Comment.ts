import Node from './Node.js'

export default class Comment extends Node {
  public readonly values: any[]

  constructor(values: any[]) {
    super()

    this.values = values
  }
}
