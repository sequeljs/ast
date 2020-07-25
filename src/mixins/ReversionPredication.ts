import Ascending from '../nodes/Ascending'
import Descending from '../nodes/Descending'

export default abstract class ReversionPredication {
  reverse(this: Ascending): Descending
  reverse(this: Descending): Ascending
  reverse(this: Ascending | Descending): Ascending | Descending {
    if (this instanceof Ascending) {
      return new Descending(this.expr)
    }

    return new Ascending(this.expr)
  }
}
