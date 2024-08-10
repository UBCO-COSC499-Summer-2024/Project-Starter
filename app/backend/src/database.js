const pgp = require('pg-promise')(/* options */)
const db = pgp({
  host: 'db',
  port: 5432,
  database: 'gradeit',
  user: 'gradeit',
  password: 'cosc499rocks'
});

const testdb = pgp({
  host: 'test-db',
  port: 5433,
  database: 'gradeit',
  user: 'gradeit',
  password: 'cosc499rocks'
})

module.exports = { db, testdb };