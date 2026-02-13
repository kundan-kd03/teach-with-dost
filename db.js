const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// test connection once
pool.query("SELECT 1")
  .then(() => console.log("DB connected successfully ✅"))
  .catch(err => console.error("DB ERROR ❌", err));

module.exports = pool;
