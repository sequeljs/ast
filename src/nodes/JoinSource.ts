import Binary from './Binary'

export default class JoinSource extends Binary {
  constructor(singleSource: any, joinop: any[] = []) {
    super(singleSource, joinop)
  }
}
