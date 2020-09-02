import SQLFunction from './SQLFunction.js'

export default class Count extends SQLFunction {
  constructor(expr: any, distinct: boolean | null = false, aliaz: any = null) {
    super(expr, aliaz)

    this.distinct = distinct
  }
}
