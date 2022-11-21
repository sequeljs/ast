import InfixOperation from './InfixOperation'

export default class Subtraction extends InfixOperation {
  constructor(left: any, right: any) {
    super('-', left, right)
  }
}
