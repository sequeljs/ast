import InfixOperation from './InfixOperation'

export default class BitwiseOr extends InfixOperation {
  constructor(left: any, right: any) {
    super('|', left, right)
  }
}
