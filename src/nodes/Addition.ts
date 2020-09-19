import InfixOperation from './InfixOperation.js'

export default class Addition extends InfixOperation {
  constructor(left: any, right: any) {
    super('+', left, right)
  }
}
