import * as mod from '../../src/errors/mod'
import EmptyJoinError from '../../src/errors/EmptyJoinError'
import EngineNotSetError from '../../src/errors/EngineNotSetError'
import SequelASTError from '../../src/errors/SequelASTError'
import VisitorError from '../../src/errors/VisitorError'
import VisitorNotImplementedError from '../../src/errors/VisitorNotImplementedError'
import VisitorNotSetError from '../../src/errors/VisitorNotSetError'
import VisitorNotSupportedError from '../../src/errors/VisitorNotSupportedError'

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
