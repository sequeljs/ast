import Binary from './Binary.js'

import type AliasPredication from '../mixins/AliasPredication.js'

class Over extends Binary {
  public readonly operator = 'OVER'

  constructor(left: any, right: any = null) {
    super(left, right)
  }
}

interface Over extends AliasPredication {}

export default Over
