import Ordering from './Ordering'

import type ReversionPredication from '../mixins/ReversionPredication'

class Ascending extends Ordering {
  public readonly direction = 'asc'

  public readonly isAscending = true

  public readonly isDescending = false
}

interface Ascending extends ReversionPredication {}

export default Ascending
