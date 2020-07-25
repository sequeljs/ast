import Unary from './Unary'

export default class With extends Unary {
  get children(): any {
    return this.expr
  }
}
