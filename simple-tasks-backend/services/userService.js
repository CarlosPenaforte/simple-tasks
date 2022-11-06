const queries = require('../config/queries');


const getUsers = (request, response) => {
  const queryString = 'SELECT * FROM users ORDER BY username ASC';
  
  queries.pool.query(queryString, (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  
  queries.pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { username, user_password, full_name, email, sex, birthday } = request.body;

  queries.pool.query(
    'INSERT INTO users (username,user_password,full_name,email,sex,birthday) VALUES ($1,$2,$3,$4,$5,$6)',
    [username, user_password, full_name, email, sex, birthday], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send('created');
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};