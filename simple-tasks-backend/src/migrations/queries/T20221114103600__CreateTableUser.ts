import { PoolClient } from 'pg';

/* eslint-disable no-unused-vars */
module.exports = async (client: PoolClient) => {
  await client.query('CREATE TABLE IF NOT EXISTS users (user_id serial primary key, username varchar(20) unique not null, user_password varchar(100) not null, full_name varchar(500) not null, email varchar(500) unique not null, sex varchar(10), birthday timestamp)')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};