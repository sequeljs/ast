import InfixOperation from './InfixOperation'

export default class BitwiseShiftLeft extends InfixOperation {
  constructor(left: any, right: any) {
    super('<<', left, right)
  }
}
