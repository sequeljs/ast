import InfixOperation from './InfixOperation'

export default class BitwiseXor extends InfixOperation {
  constructor(left: any, right: any) {
    super('^', left, right)
  }
}
