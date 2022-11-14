/* eslint-disable no-unused-vars */
module.exports = (pool) => {
  pool.query('ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL', (error, results) => {
    if (error) {
      console.log(error.message);
      throw new Error(error);
    }
  });
};