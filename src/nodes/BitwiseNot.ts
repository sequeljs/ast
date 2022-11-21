import UnaryOperation from './UnaryOperation'

export default class BitwiseNot extends UnaryOperation {
  constructor(operand: any) {
    super('~', operand)
  }
}
