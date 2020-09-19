import type Attribute from '../attributes/Attribute.js'

import type Relation from '../interfaces/Relation.js'

import type SelectManager from '../managers/SelectManager.js'

import type Node from '../nodes/Node.js'
import type SQLLiteral from '../nodes/SQLLiteral.js'

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
