import BindParam from '../../src/nodes/BindParam.js'

export default class UnboundableBindParam extends BindParam {
  isUnboundable(): boolean {
    return super.isUnboundable()
  }
}
