import Node from '../nodes/Node.js'
import Over from '../nodes/Over.js'
import SQLLiteral from '../nodes/SQLLiteral.js'

export default abstract class WindowPredications {
  over(expr: string | Node | SQLLiteral | null = null): Over {
    return new Over(this, expr)
  }
}
