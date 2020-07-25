import Node from './Node'

import type Attribute from '../attributes/Attribute'

import type Relation from '../interfaces/Relation'

export default class InsertStatement extends Node {
  public columns: Attribute[] = []

  public relation: Relation | null = null

  public select: any = null

  public values: any = null
}
