import Quoted from '../../src/nodes/Quoted.js'

export default class UnboundableQuoted extends Quoted {
  isUnboundable(): boolean {
    return true
  }
}
