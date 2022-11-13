/* eslint-disable no-unused-vars */
const queries = require('../config/queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const fetchUsers = (token, onSuccess, onError) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(e, decoded) {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      return;
    }

    queries.pool.query('SELECT * FROM users ORDER BY username ASC', (error, results) => {
      if (error) {
        console.log(error);
        if (onError) {
          onError(error.message);
        }
        return;
      }

      onSuccess(results.rows);
    });
  });
};

const fetchUserById = (token, id, onSuccess, onError) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(e, decoded) {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      return;
    }
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
  });
};

const fetchUserByUsername = (token, username, onSuccess, onError) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(e, decoded) {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      return;
    }

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
  });
};

const fetchUserByEmail = (token, email, onSuccess, onError) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(e, decoded) {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      return;
    }

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
  });
};

const insertUser = (token, user, onSuccess, onError) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(e, decoded) {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      return;
    }
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
      fetchUserByEmail(token, email, (results) => {
        const user = results;

        if (user) {
          onError('Email already exists');
          return;
        }

        //Password Hashing
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));

        const new_password = bcrypt.hashSync(user_password, salt);

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
      }, onError);
    }
  });
};

const patchUser = (token, id, user, onSuccess, onError) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(e, decoded) {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      return;
    }

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
      fetchUserById(token, id, (results) => {
        const user = results;

        if (!user) {
          console.log(user);
          onError('Id not registered');
          return;
        }

        //Password Hashing
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));

        const new_password = bcrypt.hashSync(user_password, salt);

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
      }, onError);
    }
  });
};

const removeUserById = (token, id, onSuccess, onError) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(e, decoded) {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      return;
    }

    queries.pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
      if (error) {
        console.log(error);
        onError(error.message);
        return;
      }

      onSuccess('ok');
    });
  });
};

module.exports = {
  fetchUsers,
  fetchUserById,
  fetchUserByUsername,
  fetchUserByEmail,
  insertUser,
  patchUser,
  removeUserById,
};