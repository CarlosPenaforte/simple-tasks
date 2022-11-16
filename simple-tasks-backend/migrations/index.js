/* eslint-disable no-unused-vars */
const { pool } = require('../config/pg.js');
const fs = require('fs');

const runMigration = async (migrationId, migration, client) => {
  try {
    await migration(client);

    console.log('Runned migration '+migrationId+' successfully');
  } catch (error) {
    console.log('Unable to migrate '+migrationId);
    await client.query('ROLLBACK');
    throw new Error(error);
  }
};

module.exports = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('===== Starting migrations =====');
    const files = fs.readdirSync('./migrations/queries');

    files.forEach(async (file) => {
      const file_id = file.substring(0, 15);
      const migration = require('./queries/'+file);
      const { mtime } = fs.statSync('./migrations/queries/' + file);

      let dbMigration;
      try {
        dbMigration = await client.query(
          'Select * from migrations where migration_id = $1',
          [file_id],
        );
      } catch (error) {
        console.log('Unable to fetch migration '+file_id);
        await client.query('ROLLBACK');
        throw new Error(error);
      }

      if (dbMigration.rows.length === 0) {
        await runMigration(file_id, migration, client);

        try {
          await client.query(
            'Insert into migrations(migration_id, last_modified) values ($1,$2)',
            [ file_id, mtime ],
          );
        } catch (error) {
          console.log('Error inserting migration '+file_id+' in db. Insert manually');
          await client.query('ROLLBACK');
          throw new Error(error);
        }
      } else {
        if (dbMigration.rows[0].last_modified.getTime() !== mtime.getTime()) {
          await runMigration(file_id, migration, client);

          try {
            await client.query(
              'UPDATE migrations SET last_modified = $1 WHERE migration_id = $2',
              [ mtime, file_id ],
            );
          } catch (error) {
            console.log('Error updating migration '+file_id+' in db. Update manually');
            await client.query('ROLLBACK');
            throw new Error(error);
          }
        }
      }
    });
    await client.query('COMMIT');

    await client.query('BEGIN');

    let migrationsToCheck;
    try {
      migrationsToCheck = await client.query('SELECT migration_id FROM migrations');

      if (migrationsToCheck.rows.length > 0) {
        migrationsToCheck.rows.forEach(async (migration) => {
          const file = files.find((file) => file.substring(0, 15) === migration.migration_id);

          if (!file) {
            try {
              await client.query(
                'DELETE FROM migrations WHERE migration_id = $1',
                [migration.migration_id],
              );

              console.log('Migration '+migration.migration_id+' removed successfully');
            } catch (error) {
              console.log('Error removing migration '+ migration.migration_id);
              await client.query('ROLLBACK');
              throw new Error(error);
            }
          }
        });
      }
    } catch (error) {
      console.log('Unable to check migrations from database');
      await client.query('ROLLBACK');
      throw new Error(error);
    }
  } catch (e) {
    console.log(e.message);
    await client.query('ROLLBACK');
    throw new Error(e);
  } finally {
    await client.query('COMMIT');
    console.log('===== Migrations finished =====');
    client.release();
    await pool.end();
  }
};