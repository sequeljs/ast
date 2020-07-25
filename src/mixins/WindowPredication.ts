import Node from '../nodes/Node'
import Over from '../nodes/Over'
import SQLLiteral from '../nodes/SQLLiteral'

export default abstract class WindowPredications {
  over(expr: string | Node | SQLLiteral | null = null): Over {
    return new Over(this, expr)
  }
}
