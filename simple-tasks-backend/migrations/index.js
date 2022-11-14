/* eslint-disable no-unused-vars */
const { pool } = require('../config/queries.js');
const fs = require('fs');

module.exports = async () => {
  try {
    console.log('Starting migrations');
    const files = fs.readdirSync('./migrations/queries');

    files.forEach((file) => {
      const file_id = file.substring(0, 15);

      pool.query(
        'Select * from migrations where migration_id = $1',
        [file_id],
        (error, results) => {
          if (error) {
            console.log('Unable to fetch migration '+file_id);
            throw new Error(error);
          }

          if (results.rows.length === 0) {
            const migration = require('./queries/'+file);

            try {
              migration(pool);
            } catch (e) {
              console.log('Unable to migrate '+file_id);
              throw new Error(error);
            }

            pool.query('Insert into migrations(migration_id) values ($1)', [file_id], (error, results) => {
              if (error) {
                console.log('Error inserting migration '+file_id+' in db. Insert manually');
                throw new Error(error);
              }

              console.log('Migration '+file_id+' runned succesfully');
            });
          }

          return;
        });
    });

    pool.query('SELECT migration_id FROM migrations', (error, results) => {
      if (error) {
        console.log('Unable to check migrations from database');
        throw new Error(error);
      }

      if (results.rows.length > 0) {
        results.rows.forEach((migration) => {
          try {
            const file = files.find((file) => file.substring(0, 15) === migration.migration_id);

            if (!file) {
              pool.query('DELETE FROM migrations WHERE migration_id = $1',
                [migration.migration_id],
                (error, results) => {
                  if (error) {
                    console.log('Error removing migration '+ migration.migration_id);
                    throw new Error(error);
                  }

                  console.log('Migration '+migration.migration_id+' removed successfully');
                });
            }
          } catch (e) {
            throw new Error(e);
          }
        });
      }
    });
  } catch (e) {
    console.log(e.message);
    throw new Error(e);
  }
};