import Node from './Node'
import SelectCore from './SelectCore'

export default class SelectStatement extends Node {
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
