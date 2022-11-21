import Node from './Node'

export default class BindParam extends Node {
  public readonly value: any

  constructor(value: any) {
    super()

    this.value = value
  }

  protected isInfinite(): boolean {
    return this.value === Infinity || this.value === -Infinity
  }

  protected isUnboundable(): boolean {
    return this.value.isUnboundable?.()
  }
}
