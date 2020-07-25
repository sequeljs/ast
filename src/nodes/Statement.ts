import type DeleteStatement from './DeleteStatement'
import type InsertStatement from './InsertStatement'
import type SelectStatement from './SelectStatement'
import type UpdateStatement from './UpdateStatement'

type Statement =
  | DeleteStatement
  | InsertStatement
  | SelectStatement
  | UpdateStatement

export default Statement
