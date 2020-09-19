import Ordering from './Ordering.js'

import type ReversionPredication from '../mixins/ReversionPredication.js'

class Ascending extends Ordering {
  public readonly direction = 'asc'

  public readonly isAscending = true

  public readonly isDescending = false
}

interface Ascending extends ReversionPredication {}

export default Ascending
