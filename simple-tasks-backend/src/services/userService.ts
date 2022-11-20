/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';


export const fetchUsers = async (
  token: string,
  onSuccess: (message: object) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
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
  }
};

export const fetchUserById = async (
  token: string,
  id: number,
  onSuccess: (message: object) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
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
  }
};

export const fetchUserByUsername = async (
  token: string,
  username: string,
  onSuccess: (message: object) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
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
  }
};

export const fetchUserByEmail = async (
  email: string,
  onSuccess: (message: object) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');

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
    client.release();
  }
};

export const insertUser = async (
  user: {
    username: string;
    user_password: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
    confirm_password: string;
  },
  onSuccess: (message: string | object) => void,
  onError: (message: string | object) => void,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');

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
      fetchUserByEmail(email, async (results:object) => {
        const user = results;

        if (user) {
          onError('Email already exists');
          await client.query('ROLLBACK');
          return;
        }

        //Password Hashing
        const salt: string = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS || '8'));

        const new_password: string = bcrypt.hashSync(user_password, salt);

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
    client.release();
  }
};

export const patchUser = async (
  token: string,
  id: number,
  user: {
    username: string;
    user_password: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
    confirm_password: string;
  },
  onSuccess: (message: string | object) => void,
  onError: (message: string | object) => void,
): Promise<void> => {
  const client: PoolClient = await pool.connect();
  await client.query('BEGIN');
  if (process.env.TOKEN_KEY) {
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
        fetchUserById(token, id, async (results: string | object) => {
          const user = results;

          if (!user) {
            console.log(user);
            onError('Id not registered');
            await client.query('ROLLBACK');
            return;
          }

          //Password Hashing
          const salt: string = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS || '8'));

          const new_password: string = bcrypt.hashSync(user_password, salt);

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
  }
};

export const removeUserById = async (
  token: string,
  id: number,
  onSuccess: (message: string | object) => void,
  onError: (message: string | object) => void,
): Promise<void> => {
  const client: PoolClient = await pool.connect();
  await client.query('BEGIN');
  if (process.env.TOKEN_KEY) {
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
  }
};