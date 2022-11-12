/* eslint-disable no-unused-vars */
const queries = require('../config/queries');
const bcrypt = require('bcryptjs');


const fetchUsers = (onSuccess, onError) => {
  const queryString = 'SELECT * FROM users ORDER BY username ASC';

  queries.pool.query(queryString, (error, results) => {
    if (error) {
      console.log(error);
      if (onError) {
        onError(error.message);
      }
      return;
    }

    onSuccess(results.rows);
  });
};

const fetchUserById = (id, onSuccess, onError) => {
  queries.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      console.log(error);
      if (onError) {
        onError(error.message);
      }
      return;
    }

    onSuccess(results.rows[0]);
  });
};

const fetchUserByUsername = (username, onSuccess, onError) => {
  queries.pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
    if (error) {
      console.log(error);
      if (onError) {
        onError(error.message);
      }
      return;
    }

    onSuccess(results.rows[0]);
  });
};

const fetchUserByEmail = (email, onSuccess, onError) => {
  queries.pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      console.log(error);
      if (onError) {
        onError(error.message);
      }
      return;
    }

    onSuccess(results.rows[0]);
  });
};

const insertUser = (user, onSuccess, onError) => {
  const {
    username, user_password, full_name, email, sex, birthday, confirm_password,
  } = user;

  if (!username || !email || !user_password || !confirm_password) {
    onError('Fill the required fields');
    return;
  }
  //Confirm Passwords
  if (user_password !== confirm_password) {
    onError('Password must match');
    return;
  } else {
    //Validation
    fetchUserByEmail(email, (results) => {
      const user = results;

      if (user) {
        onError('Email already exists');
        return;
      }

      //Password Hashing
      bcrypt.genSalt(process.env.SALT_ROUNDS, (err, salt) =>
        bcrypt.hash(user_password, salt, (err, hash) => {
          if (err) {
            onError(err.message);
            throw err;
          }
          const new_password = hash;

          queries.pool.query(
            'INSERT INTO users (username,user_password,full_name,email,sex,birthday) VALUES ($1,$2,$3,$4,$5,$6)',
            [
              username, new_password, full_name, email, sex, birthday,
            ], (error, results) => {
              if (error) {
                console.log(error);
                onError(error.message);
                return;
              }
              onSuccess('ok');
            });
        }),
      );
    }, onError);
  }
};

const patchUser = (id, user, onSuccess, onError) => {
  const {
    username, user_password, full_name, email, sex, birthday, confirm_password,
  } = user;

  if (!username || !email || !user_password || !confirm_password) {
    onError('Fill the required fields');
    return;
  }
  //Confirm Passwords
  if (user_password !== confirm_password) {
    onError('Password must match');
    return;
  } else {
    //Validation
    fetchUserById(id, (results) => {
      const user = results;

      if (!user) {
        console.log(user);
        onError('Id not registered');
        return;
      }

      //Password Hashing
      bcrypt.genSalt(process.env.SALT_ROUNDS, (err, salt) =>
        bcrypt.hash(user_password, salt, (err, hash) => {
          if (err) {
            onError(err.message);
            throw err;
          }
          const new_password = hash;

          queries.pool.query(
            'UPDATE users SET (username,user_password,full_name,email,sex,birthday) = ($1,$2,$3,$4,$5,$6) WHERE user_id = $7',
            [
              username, new_password, full_name, email, sex, birthday, id,
            ], (error, results) => {
              if (error) {
                console.log(error);
                onError(error.message);
                return;
              }
              onSuccess('ok');
            });
        }),
      );
    }, onError);
  }
};

const removeUserById = (id, onSuccess, onError) => {
  queries.pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      console.log(error);
      onError(error.message);
      return;
    }

    onSuccess('ok');
  });
};

const authenticateUser = (email, password, onSuccess, onError) => {
  try {
    fetchUserByEmail(email, async (results) => {
      const user = results;
      console.log(user);
      if (user) {
        const cmp = await bcrypt.compare(password, user.user_password);
        if (cmp) {
          onSuccess(user);
        } else {
          onError('Wrong username or password.');
        }
      } else {
        onError('Wrong username or password.');
      }
    }, onError);
  } catch (error) {
    console.log(error);
    onError('Internal Server error Occured');
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  fetchUserByUsername,
  fetchUserByEmail,
  insertUser,
  patchUser,
  removeUserById,
  authenticateUser,
};