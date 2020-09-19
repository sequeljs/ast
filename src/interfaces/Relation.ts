import type TableAlias from '../nodes/TableAlias.js'

import type Table from '../Table.js'

type Relation = Table | TableAlias

export default Relation
