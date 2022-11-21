import As from '../nodes/As'
import SQLLiteral from '../nodes/SQLLiteral'

export default abstract class AliasPredication {
  as(other: string | SQLLiteral): As {
    return new As(this, new SQLLiteral(other))
  }
}
