import SQLFunction from './SQLFunction'

export default class NamedSQLFunction extends SQLFunction {
  public name: any

  constructor(name: any, expr: any, aliaz: any = null) {
    super(expr, aliaz)

    this.name = name
  }

  as(aliaz: any): NamedSQLFunction {
    return super.as(aliaz) as NamedSQLFunction
  }
}
