import Quoted from '../../src/nodes/Quoted'

export default class UnboundableQuoted extends Quoted {
  isUnboundable(): boolean {
    return true
  }
}
