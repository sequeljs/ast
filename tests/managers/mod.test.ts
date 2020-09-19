import * as mod from '../../src/managers/mod.js'
import DeleteManager from '../../src/managers/DeleteManager.js'
import InsertManager from '../../src/managers/InsertManager.js'
import SelectManager from '../../src/managers/SelectManager.js'
import TreeManager from '../../src/managers/TreeManager.js'
import UpdateManager from '../../src/managers/UpdateManager.js'

test('exports from module', () => {
  expect(mod.DeleteManager).toStrictEqual(DeleteManager)
  expect(mod.InsertManager).toStrictEqual(InsertManager)
  expect(mod.SelectManager).toStrictEqual(SelectManager)
  expect(mod.TreeManager).toStrictEqual(TreeManager)
  expect(mod.UpdateManager).toStrictEqual(UpdateManager)
})
