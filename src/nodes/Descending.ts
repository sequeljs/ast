import Ordering from './Ordering.js'

import type ReversionPredication from '../mixins/ReversionPredication.js'

class Descending extends Ordering {
  public readonly direction = 'desc'

  public readonly isAscending = false

  public readonly isDescending = true
}

interface Descending extends ReversionPredication {}

export default Descending
