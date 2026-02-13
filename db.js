const { Pool } = require("pg");

const dbPool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "teach_with_dost",
  password: "123456789",
  port: 5432,
});

module.exports = dbPool;
