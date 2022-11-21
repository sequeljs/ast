import Ordering from './Ordering'

import type ReversionPredication from '../mixins/ReversionPredication'

class Descending extends Ordering {
  public readonly direction = 'desc'

  public readonly isAscending = false

  public readonly isDescending = true
}

interface Descending extends ReversionPredication {}

export default Descending
