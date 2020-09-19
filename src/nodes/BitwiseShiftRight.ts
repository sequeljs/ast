import InfixOperation from './InfixOperation.js'

export default class BitwiseShiftRight extends InfixOperation {
  constructor(left: any, right: any) {
    super('>>', left, right)
  }
}
