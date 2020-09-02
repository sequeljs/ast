import Binary from './Binary.js'

export default class Regexp extends Binary {
  public caseSensitive: boolean

  constructor(left: any, right: any, caseSensitive = true) {
    super(left, right)

    this.caseSensitive = caseSensitive
  }
}
