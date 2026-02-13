const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ✅ Render required
  },
});

pool.connect()
  .then(() => console.log("DB connected successfully ✅"))
  .catch(err => console.error("DB connection error ❌", err));

module.exports = pool;
