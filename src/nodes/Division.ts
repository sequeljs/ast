import InfixOperation from './InfixOperation.js'

export default class Division extends InfixOperation {
  constructor(left: any, right: any) {
    super('/', left, right)
  }
}
