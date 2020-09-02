import InfixOperation from './InfixOperation.js'

export default class Concat extends InfixOperation {
  constructor(left: any, right: any) {
    super('||', left, right)
  }
}
