import '../src/mod'

import SequelAST from '../src/SequelAST'

import FakeRecord from './support/FakeRecord'

SequelAST.engine = new FakeRecord()
