import NodeExpression from './NodeExpression.js'
import SelectCore from './SelectCore.js'

import type AliasPredication from '../mixins/AliasPredication.js'

class SelectStatement extends NodeExpression {
  public readonly cores: SelectCore[]

  public limit: any = null

  public lock: any = null

  public offset: any = null

  public orders: any[] = []

  public with: any = null

  constructor(cores: SelectCore[] = [new SelectCore()]) {
    super()

    this.cores = cores
  }
}

interface SelectStatement extends AliasPredication {}

export default SelectStatement
