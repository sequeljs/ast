import Node from './Node.js'

import type Attribute from '../attributes/Attribute.js'

import type Relation from '../interfaces/Relation.js'

export default class InsertStatement extends Node {
  public columns: Attribute[] = []

  public relation: Relation | null = null

  public select: any = null

  public values: any = null
}
