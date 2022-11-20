import pool from '../config/pg';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { PoolClient } from 'pg';

export const authenticateUser = async (
  email: string, password: string,
  onSuccess: (message: string | object) => void,
  onError: (message: string | object) => void,
  translate: (toTranslate: string) => string,
): Promise<void> => {
  const client: PoolClient = await pool.connect();
  await client.query('BEGIN');
  try {
    client.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
      if (error || !results.rows[0]) {
        console.log(error);
        onError(translate('LOGIN.WRONG_CREDENTIALS'));
        await client.query('ROLLBACK');
        return;
      }

      const user = results.rows[0];
      const cmp: boolean = bcrypt.compareSync(password, user.user_password);
      if (cmp) {
        if (process.env.TOKEN_KEY !== undefined) {
          const secret: Secret = process.env.TOKEN_KEY;
          const token: string = jwt.sign({ id: user.user_id }, secret, { expiresIn: 3600 });
          onSuccess({
            token, user,
          });
          await client.query('COMMIT');
        } else {
          onError(translate('SYSTEM.INTERNAL_ERROR'));
          await client.query('ROLLBACK');
        }
      } else {
        onError(translate('LOGIN.WRONG_CREDENTIALS'));
        await client.query('ROLLBACK');
      }
    });
  } catch (error) {
    console.log(error);
    onError(translate('SYSTEM.INTERNAL_ERROR'));
    await client.query('ROLLBACK');
  }

  client.release();
};