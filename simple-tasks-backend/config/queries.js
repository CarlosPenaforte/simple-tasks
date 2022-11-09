const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PG_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  pool,
};