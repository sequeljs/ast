import CRUD from './mixins/CRUD'
import FactoryMethods from './mixins/FactoryMethods'
import SelectPredications from './mixins/SelectPredications'
import applyMixins from './mixins/applyMixins'

import Table from './Table'

applyMixins(Table, [CRUD, FactoryMethods, SelectPredications])

export default Table
