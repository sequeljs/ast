import type DeleteStatement from './DeleteStatement.js'
import type InsertStatement from './InsertStatement.js'
import type SelectStatement from './SelectStatement.js'
import type UpdateStatement from './UpdateStatement.js'

type Statement =
  | DeleteStatement
  | InsertStatement
  | SelectStatement
  | UpdateStatement

export default Statement
