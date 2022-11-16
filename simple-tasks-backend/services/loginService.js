const { pool } = require('../config/pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticateUser = async (email, password, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  try {
    client.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
      if (error || !results.rows[0]) {
        console.log(error);
        onError('Wrong email or password.');
        await client.query('ROLLBACK');
        return;
      }

      const user = results.rows[0];
      const cmp = bcrypt.compareSync(password, user.user_password);
      if (cmp) {
        const token = jwt.sign({ id: user.user_id }, process.env.TOKEN_KEY, { expiresIn: 3600 });
        onSuccess({
          token, user,
        });
        await client.query('COMMIT');
      } else {
        onError('Wrong email or password.');
        await client.query('ROLLBACK');
      }
    });
  } catch (error) {
    console.log(error);
    onError('Internal Server error Occured');
    await client.query('ROLLBACK');
  }
};

module.exports = {
  authenticateUser,
};