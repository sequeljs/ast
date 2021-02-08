# Sequel.js - AST

`@sequeljs/ast` is a SQL AST manager for JavaScript.

[![build](https://github.com/sequeljs/ast/workflows/build/badge.svg)](https://github.com/sequeljs/ast/)
[![test](https://github.com/sequeljs/ast/workflows/test/badge.svg)](https://github.com/sequeljs/ast/)
[![coverage](https://coveralls.io/repos/github/sequeljs/ast/badge.svg?branch=main)](https://coveralls.io/github/sequeljs/ast?branch=main)
[![license](https://img.shields.io/github/license/sequeljs/ast)](https://github.com/sequeljs/ast/blob/main/LICENSE.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](https://github.com/sequeljs/ast/blob/main/CODE_OF_CONDUCT.md)

## Installation

```JavaScript
npm install --save @sequeljs/ast
```

## A Gentle Introduction

Generating a query with Sequel.js AST is simple. For example, in order to
produce

```sql
SELECT * FROM "users"
```

you construct a table relation and convert it to SQL:

```JavaScript
let users = new Table('users')
users = users.project('*')
users.toSQL()
```

### More Sophisticated Queries

Here is a whirlwind tour through the most common SQL operators. These will
probably cover 80% of all interaction with the database.

First is the 'restriction' operator, `where`:

```JavaScript
users.project('*').where(users.get('name').eq('amy'))
// SELECT * FROM "users" WHERE "users"."name" = 'amy'
```

What would, in SQL, be part of the `SELECT` clause is called in Sequel.js AST a
`projection`:

```JavaScript
users.project(users.get('id'))
// SELECT "users"."id" FROM "users"
```

Comparison operators `=`, `!=`, `<`, `>`, `<=`, `>=`, `IN`:

```JavaScript
users.where(users.get('age').eq(10)).project('*')
// SELECT * FROM "users" WHERE "users"."age" = 10

users.where(users.get('age').notEq(10)).project('*')
// SELECT * FROM "users" WHERE "users"."age" != 10

users.where(users.get('age').lt(10)).project('*')
// SELECT * FROM "users" WHERE "users"."age" < 10

users.where(users.get('age').gt(10)).project('*')
// SELECT * FROM "users" WHERE "users"."age" > 10

users.where(users.get('age').lteq(10)).project('*')
// SELECT * FROM "users" WHERE "users"."age" <= 10

users.where(users.get('age').gteq(10)).project('*')
// SELECT * FROM "users" WHERE "users"."age" >= 10

users.where(users.get('age').inVal([20, 16, 17])).project('*')
// SELECT * FROM "users" WHERE "users"."age" IN (20, 16, 17)
```

Bitwise operators `&`, `|`, `^`, `<<`, `>>`:

```JavaScript
users.where((users.get('bitmap').bitwiseAnd(16)).gt(0)).project('*')
// SELECT * FROM "users" WHERE ("users"."bitmap" & 16) > 0

users.where((users.get('bitmap').bitwiseOr(16)).gt(0)).project('*')
// SELECT * FROM "users" WHERE ("users"."bitmap" | 16) > 0

users.where((users.get('bitmap').bitwiseXor(16)).gt(0)).project('*')
// SELECT * FROM "users" WHERE ("users"."bitmap" ^ 16) > 0

users.where((users.get('bitmap').bitwiseShiftLeft(1)).gt(0)).project('*')
// SELECT * FROM "users" WHERE ("users"."bitmap" << 1) > 0

users.where((users.get('bitmap').bitwiseShiftRight(1)).gt(0)).project('*')
// SELECT * FROM "users" WHERE ("users"."bitmap" >> 1) > 0

users.where((users.get('bitmap').bitwiseNot()).gt(0)).project('*')
// SELECT * FROM "users" WHERE  ~ "users"."bitmap" > 0
```

Joins resemble SQL strongly:

```JavaScript
users.join(photos).on(users.get('id').eq(photos.get('user_id'))).project('*')
// SELECT * FROM "users" INNER JOIN "photos" ON "users"."id" = "photos"."user_id"
```

Left joins:

```JavaScript
users.join(photos, OuterJoin).on(users.get('id').eq(photos.get('user_id'))).project('*')
// SELECT * FROM "users" LEFT OUTER JOIN "photos" ON "users"."id" = "photos"."user_id"
```

What are called `LIMIT` and `OFFSET` in SQL are called `take` and `skip` in
Sequel.js AST:

```JavaScript
users.take(5).project('*') // SSELECT * FROM "users" LIMIT 5
users.skip(4).project('*') // SELECT * FROM "users" OFFSET 4
```

`GROUP BY` is called `group`:

```JavaScript
users.project(users.get('name')).group(users.get('name'))
// SELECT "users"."name" FROM "users" GROUP BY "users"."name"
```

The best property of Sequel.js AST is its "composability," or closure under all
operations. For example, to restrict AND project, just "chain" the method
invocations:

```JavaScript
users
  .where(users.get('name').eq('amy'))
  .project(users.get('id'))
// SELECT "users"."id" FROM "users" WHERE "users"."name" = 'amy'
```

All operators are chainable in this way, and they are chainable any number of
times, in any order.

```JavaScript
users.where(users.get('name').eq('bob')).where(users.get('age').lt(25))
```

The `OR` operator works like this:

```JavaScript
users.where(users.get('name').eq('bob').or(users.get('age').lt(25)))
```

The `AND` operator behaves similarly. Here is an example of the `DISTINCT`
operator:

```JavaScript
const posts = new Table('posts')
posts.project(posts.get('title')).distinct()
posts.toSQL() // SELECT DISTINCT "posts"."title" FROM "posts"
```

Aggregate functions `AVG`, `SUM`, `COUNT`, `MIN`, `MAX`, `HAVING`:

```JavaScript
photos.group(photos.get('user_id')).having(photos.get('id').count().gt(5))
// SELECT FROM "photos" GROUP BY "photos"."user_id" HAVING COUNT("photos"."id") > 5

users.project(users.get('age').sum())
// SELECT SUM("users"."age") FROM "users"

users.project(users.get('age').average())
// SELECT AVG("users"."age") FROM "users"

users.project(users.get('age').maximum())
// SELECT MAX("users"."age") FROM "users"

users.project(users.get('age').minimum())
// SELECT MIN("users"."age") FROM "users"

users.project(users.get('age').count())
// SELECT COUNT("users"."age") FROM "users"
```

Aliasing Aggregate Functions:

```JavaScript
users.project(users.get('age').average().as("mean_age"))
// SELECT AVG("users"."age") AS mean_age FROM "users"
```

### The Advanced Features

The examples above are fairly simple and other libraries match or come close to
matching the expressiveness of Sequel.js AST.

#### Inline math operations

Suppose we have a table `products` with prices in different currencies. And we
have a table `currency_rates`, of constantly changing currency rates. In
Sequel.js AST:

```JavaScript
products = new Table('products')
// Attributes: ['id', 'name', 'price', 'currency_id']

currency_rates = new Table('currency_rates')
// Attributes: ['from_id', 'to_id', 'date', 'rate']
```

Now, to order products by price in user preferred currency simply call:

```JavaScript
products
  .join('currency_rates')
  .on(products.get('currency_id').eq(currencyRates.get('from_id')))
  .where(currencyRates.get('to_id').eq(userPreferredCurrency))
  .where(currencyRates.get('date').eq(new Date()))
  .order(products.get('price').multiply(currencyRates.get('rate')))
```

#### Complex Joins

##### Alias

Where Sequel.js AST really shines is in its ability to handle complex joins and
aggregations. As a first example, let's consider an "adjacency list", a tree
represented in a table. Suppose we have a table `comments`, representing a
threaded discussion:

```JavaScript
comments = new Table('comments')
```

And this table has the following attributes:

```JavaScript
// ['id', 'body', 'parent_id']
```

The `parent_id` column is a foreign key from the `comments` table to itself.
Joining a table to itself requires aliasing in SQL. This aliasing can be handled
from Sequel.js AST as below:

```JavaScript
replies = comments.alias()
commentsWithReplies = comments
  .join(replies)
  .on(replies.get('parent_id').eq(comments.get('id')))
  .where(comments.get('id').eq(1))
  .project('*')

// SELECT * FROM "comments" INNER JOIN "comments" "comments_2"
// ON "comments_2"."parent_id" = "comments"."id"
// WHERE "comments"."id" = 1
```

This will return the reply for the first comment.

##### CTE

[Common Table Expressions (CTE)](https://en.wikipedia.org/wiki/Common_table_expressions#Common_table_expression)
support via:

Create a `CTE`

```JavaScript
cteTable = new Table('cte_table')
composedCte = new Nodes.As(cteTable, photos.where(photos.get('created_at').gt(new Date('2021-01-01'))))
```

Use the created `CTE`:

```JavaScript
users
  .join(cteTable)
  .on(users.get('id').eq(cteTable.get('user_id')))
  .project(users.get('id'), cteTable.get('click').sum())
  .with(composedCte)

// WITH "cte_table" AS (SELECT FROM "photos" WHERE "photos"."created_at" > '2021-01-01 00:00:00')
// SELECT "users"."id", SUM("cte_table"."click")
// FROM "users" INNER JOIN "cte_table" ON "users"."id" = "cte_table"."user_id"
```

#### Write SQL strings

When your query is too complex for `Sequel.js AST`, you can use
`Nodes.SQLLiteral`:

```JavaScript
photoClicks = new Nodes.SQLLiteral(`
  CASE WHEN condition1 THEN calculation1
  WHEN condition2 THEN calculation2
  WHEN condition3 THEN calculation3
  ELSE default_calculation END
  `)
photos.project(photoClicks.as("photo_clicks"))

// SELECT
// CASE WHEN condition1 THEN calculation1
// WHEN condition2 THEN calculation2
// WHEN condition3 THEN calculation3
// ELSE default_calculation END
//   AS photo_clicks FROM "photos"
```

## Contributing

Feel free to contribute with this library. For more information, take a look at
our
[contributing guide](https://github.com/sequeljs/ast/blob/main/CONTRIBUTING.md).

## License

[MIT](https://github.com/sequeljs/ast/blob/main/LICENSE)

## Inspiration

`@sequeljs/ast` is basically a rewrite of
[Rails' Arel](https://github.com/rails/rails/tree/v6.0.3.2/activerecord/lib/arel)
library in TypeScript.
