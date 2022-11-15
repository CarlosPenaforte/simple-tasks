/* eslint-disable no-unused-vars */
const { pool } = require('../config/pg.js');
const fs = require('fs');

module.exports = async (callback) => {
  try {
    console.log('===== Starting migrations =====');
    const files = fs.readdirSync('./migrations/queries');

    files.forEach(async (file) => {
      const file_id = file.substring(0, 15);

      await pool.query(
        'Select * from migrations where migration_id = $1',
        [file_id],
      ).then(async (results) => {
        if (results.rows.length === 0) {
          const migration = require('./queries/'+file);

          try {
            migration(pool);
          } catch (error) {
            console.log('Unable to migrate '+file_id);
            throw new Error(error);
          }

          await pool.query(
            'Insert into migrations(migration_id) values ($1)',
            [file_id],
          ).then(() => {
            console.log('Migration '+file_id+' runned succesfully');
          }).catch((error) => {
            if (error) {
              console.log('Error inserting migration '+file_id+' in db. Insert manually');
              throw new Error(error);
            }
          });
        }
      }).catch((error) => {
        if (error) {
          console.log('Unable to fetch migration '+file_id);
          throw new Error(error);
        }
      });
    });

    await pool.query('SELECT migration_id FROM migrations')
      .then((results) => {
        if (results.rows.length > 0) {
          results.rows.forEach(async (migration) => {
            try {
              const file = files.find((file) => file.substring(0, 15) === migration.migration_id);

              if (!file) {
                await pool.query(
                  'DELETE FROM migrations WHERE migration_id = $1',
                  [migration.migration_id],
                ).then(() => {
                  console.log('Migration '+migration.migration_id+' removed successfully');
                }).catch((error) => {
                  if (error) {
                    console.log('Error removing migration '+ migration.migration_id);
                    throw new Error(error);
                  }
                });
              }
            } catch (e) {
              throw new Error(e);
            }
          });
        }
      }).catch((error) => {
        if (error) {
          console.log('Unable to check migrations from database');
          throw new Error(error);
        }
      });
    console.log('===== Migrations finished =====');
    callback();
  } catch (e) {
    console.log(e.message);
    throw new Error(e);
  }
};