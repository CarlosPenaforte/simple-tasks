/* eslint-disable no-unused-vars */
module.exports = async (client) => {
  await client.query('ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS start_date TIMESTAMP NOT NULL')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};