import NodeExpression from './NodeExpression'
import SelectCore from './SelectCore'

import type AliasPredication from '../mixins/AliasPredication'

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
