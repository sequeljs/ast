import Binary from './Binary'

import type AliasPredication from '../mixins/AliasPredication'

class Over extends Binary {
  public readonly operator = 'OVER'

  constructor(left: any, right: any = null) {
    super(left, right)
  }
}

interface Over extends AliasPredication {}

export default Over
