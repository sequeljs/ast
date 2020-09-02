import CRUD from './mixins/CRUD.js'
import FactoryMethods from './mixins/FactoryMethods.js'
import SelectPredications from './mixins/SelectPredications.js'
import applyMixins from './mixins/applyMixins.js'

import Table from './Table.js'

applyMixins(Table, [CRUD, FactoryMethods, SelectPredications])

export default Table
