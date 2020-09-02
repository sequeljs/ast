import Unary from './Unary.js'

export default class With extends Unary {
  get children(): any {
    return this.expr
  }
}
