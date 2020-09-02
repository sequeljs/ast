import UnaryOperation from './UnaryOperation.js'

export default class BitwiseNot extends UnaryOperation {
  constructor(operand: any) {
    super('~', operand)
  }
}
