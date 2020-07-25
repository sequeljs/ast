import Node from './Node'

import type Attribute from '../attributes/Attribute'

export default class Casted extends Node {
  public readonly attribute: string | Attribute

  public readonly value: any

  constructor(value: any, attribute: string | Attribute) {
    super()

    this.attribute = attribute
    this.value = value
  }
}
