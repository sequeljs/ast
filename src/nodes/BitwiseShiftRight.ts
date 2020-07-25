import InfixOperation from './InfixOperation'

export default class BitwiseShiftRight extends InfixOperation {
  constructor(left: any, right: any) {
    super('>>', left, right)
  }
}
