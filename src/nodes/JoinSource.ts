import Binary from './Binary.js'

export default class JoinSource extends Binary {
  constructor(singleSource: any, joinop: any[] = []) {
    super(singleSource, joinop)
  }
}
