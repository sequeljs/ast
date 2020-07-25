import Node from './Node'

export default class And extends Node {
  public readonly children: any[]

  get left(): any {
    return this.children[0]
  }

  get right(): any {
    return this.children[1]
  }

  constructor(children: any[]) {
    super()

    this.children = children
  }
}
