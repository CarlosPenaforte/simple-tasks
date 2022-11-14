const queries = require('../config/queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticateUser = (email, password, onSuccess, onError) => {
  try {
    queries.pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
      if (error || !results.rows[0]) {
        console.log(error);
        if (onError) {
          onError('Wrong email or password.');
        }
        return;
      }

      const user = results.rows[0];
      const cmp = bcrypt.compareSync(password, user.user_password);
      if (cmp) {
        const token = jwt.sign({ id: user.user_id }, process.env.TOKEN_KEY, { expiresIn: 3600 });
        onSuccess({
          token, user,
        });
      } else {
        onError('Wrong email or password.');
      }
    });
  } catch (error) {
    console.log(error);
    onError('Internal Server error Occured');
  }
};

module.exports = {
  authenticateUser,
};