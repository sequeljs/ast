import type Attribute from '../attributes/Attribute'

import type Relation from '../interfaces/Relation'

import type SelectManager from '../managers/SelectManager'

import type Node from '../nodes/Node'
import type SQLLiteral from '../nodes/SQLLiteral'

type Visitable =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | Attribute
  | Date
  | Node
  | Relation
  | SQLLiteral
  | SelectManager

export default Visitable
