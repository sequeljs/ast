import * as mod from '../../src/managers/mod'
import DeleteManager from '../../src/managers/DeleteManager'
import InsertManager from '../../src/managers/InsertManager'
import SelectManager from '../../src/managers/SelectManager'
import TreeManager from '../../src/managers/TreeManager'
import UpdateManager from '../../src/managers/UpdateManager'

test('exports from module', () => {
  expect(mod.DeleteManager).toStrictEqual(DeleteManager)
  expect(mod.InsertManager).toStrictEqual(InsertManager)
  expect(mod.SelectManager).toStrictEqual(SelectManager)
  expect(mod.TreeManager).toStrictEqual(TreeManager)
  expect(mod.UpdateManager).toStrictEqual(UpdateManager)
})
