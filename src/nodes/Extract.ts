import Unary from './Unary'

export default class Extract extends Unary {
  public field: any

  constructor(expr: any, field: any) {
    super(expr)

    this.field = field
  }
}
