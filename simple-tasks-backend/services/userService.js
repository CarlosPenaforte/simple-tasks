/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/pg');


const fetchUsers = async (token, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      await client.query('ROLLBACK');
      return;
    }

    client.query('SELECT * FROM users ORDER BY username ASC', async (error, results) => {
      if (error) {
        console.log(error);
        onError(error.message);
        await client.query('ROLLBACK');
        return;
      }

      onSuccess(results.rows);
      await client.query('COMMIT');
    });
  });
  client.release();
};

const fetchUserById = async (token, id, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      await client.query('ROLLBACK');
      return;
    }
    client.query('SELECT * FROM users WHERE user_id = $1', [id], async (error, results) => {
      if (error) {
        console.log(error);
        onError(error.message);
        await client.query('ROLLBACK');
        return;
      }

      onSuccess(results.rows[0]);
      await client.query('COMMIT');
    });
  });
  client.release();
};

const fetchUserByUsername = async (token, username, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      await client.query('ROLLBACK');
      return;
    }

    client.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
      if (error) {
        console.log(error);
        onError(error.message);
        await client.query('ROLLBACK');
        return;
      }

      onSuccess(results.rows[0]);
      await client.query('COMMIT');
    });
  });
  client.release();
};

const fetchUserByEmail = async (token, email, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      await client.query('ROLLBACK');
      return;
    }

    client.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
      if (error) {
        console.log(error);
        onError(error.message);
        await client.query('ROLLBACK');
        return;
      }

      onSuccess(results.rows[0]);
      await client.query('COMMIT');
    });
  });
  client.release();
};

const insertUser = async (token, user, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      await client.query('ROLLBACK');
      return;
    }
    const {
      username, user_password, full_name, email, sex, birthday, confirm_password,
    } = user;

    if (!username || !email || !user_password || !confirm_password) {
      onError('Fill the required fields');
      await client.query('ROLLBACK');
      return;
    }
    //Confirm Passwords
    if (user_password !== confirm_password) {
      onError('Password must match');
      await client.query('ROLLBACK');
      return;
    } else {
    //Validation
      fetchUserByEmail(token, email, async (results) => {
        const user = results;

        if (user) {
          onError('Email already exists');
          await client.query('ROLLBACK');
          return;
        }

        //Password Hashing
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));

        const new_password = bcrypt.hashSync(user_password, salt);

        client.query(
          'INSERT INTO users (username,user_password,full_name,email,sex,birthday) VALUES ($1,$2,$3,$4,$5,$6)',
          [
            username, new_password, full_name, email, sex, birthday,
          ], async (error, results) => {
            if (error) {
              console.log(error);
              onError(error.message);
              await client.query('ROLLBACK');
              return;
            }
            onSuccess('ok');
            await client.query('COMMIT');
          });
      }, async (error) => {
        onError(error);
        await client.query('ROLLBACK');
      });
    }
  });
  client.release();
};

const patchUser = async (token, id, user, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      await client.query('ROLLBACK');
      return;
    }

    const {
      username, user_password, full_name, email, sex, birthday, confirm_password,
    } = user;

    if (!username || !email || !user_password || !confirm_password) {
      onError('Fill the required fields');
      await client.query('ROLLBACK');
      return;
    }
    //Confirm Passwords
    if (user_password !== confirm_password) {
      onError('Password must match');
      await client.query('ROLLBACK');
      return;
    } else {
    //Validation
      fetchUserById(token, id, async (results) => {
        const user = results;

        if (!user) {
          console.log(user);
          onError('Id not registered');
          await client.query('ROLLBACK');
          return;
        }

        //Password Hashing
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));

        const new_password = bcrypt.hashSync(user_password, salt);

        client.query(
          'UPDATE users SET (username,user_password,full_name,email,sex,birthday) = ($1,$2,$3,$4,$5,$6) WHERE user_id = $7',
          [
            username, new_password, full_name, email, sex, birthday, id,
          ], async (error, results) => {
            if (error) {
              console.log(error);
              onError(error.message);
              await client.query('ROLLBACK');
              return;
            }
            onSuccess('ok');
            await client.query('COMMIT');
          });
      }, async (error) => {
        onError(error);
        await client.query('ROLLBACK');
      });
    }
  });
  client.release();
};

const removeUserById =async (token, id, onSuccess, onError) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
    if (e) {
      onError({
        auth: false, message: 'Falha ao autenticar o token.',
      });
      await client.query('ROLLBACK');
      return;
    }

    client.query('DELETE FROM users WHERE user_id = $1', [id], async (error, results) => {
      if (error) {
        console.log(error);
        onError(error.message);
        await client.query('ROLLBACK');
        return;
      }

      onSuccess('ok');
      await client.query('COMMIT');
    });
  });
  client.release();
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