import BindParam from '../../src/nodes/BindParam'

export default class UnboundableBindParam extends BindParam {
  isUnboundable(): boolean {
    return super.isUnboundable()
  }
}
