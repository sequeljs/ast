import InfixOperation from './InfixOperation.js'

export default class BitwiseXor extends InfixOperation {
  constructor(left: any, right: any) {
    super('^', left, right)
  }
}
