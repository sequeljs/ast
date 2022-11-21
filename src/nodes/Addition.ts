import InfixOperation from './InfixOperation'

export default class Addition extends InfixOperation {
  constructor(left: any, right: any) {
    super('+', left, right)
  }
}
