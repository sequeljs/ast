import * as mod from '../../src/errors/mod.js'
import EmptyJoinError from '../../src/errors/EmptyJoinError.js'
import EngineNotSetError from '../../src/errors/EngineNotSetError.js'
import SequelASTError from '../../src/errors/SequelASTError.js'
import VisitorError from '../../src/errors/VisitorError.js'
import VisitorNotImplementedError from '../../src/errors/VisitorNotImplementedError.js'
import VisitorNotSetError from '../../src/errors/VisitorNotSetError.js'
import VisitorNotSupportedError from '../../src/errors/VisitorNotSupportedError.js'

test('exports from module', () => {
  expect(mod.EmptyJoinError).toStrictEqual(EmptyJoinError)
  expect(mod.EngineNotSetError).toStrictEqual(EngineNotSetError)
  expect(mod.SequelASTError).toStrictEqual(SequelASTError)
  expect(mod.VisitorError).toStrictEqual(VisitorError)
  expect(mod.VisitorNotImplementedError).toStrictEqual(
    VisitorNotImplementedError,
  )
  expect(mod.VisitorNotSetError).toStrictEqual(VisitorNotSetError)
  expect(mod.VisitorNotSupportedError).toStrictEqual(VisitorNotSupportedError)
})
