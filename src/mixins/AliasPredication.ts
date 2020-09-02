import As from '../nodes/As.js'
import SQLLiteral from '../nodes/SQLLiteral.js'

export default abstract class AliasPredication {
  as(other: string | SQLLiteral): As {
    return new As(this, new SQLLiteral(other))
  }
}
