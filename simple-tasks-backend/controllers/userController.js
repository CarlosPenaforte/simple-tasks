/* eslint-disable no-unused-vars */
const {
  fetchUsers,
  fetchUserById,
  fetchUserByUsername,
  fetchUserByEmail,
  insertUser,
  patchUser,
  removeUserById,
} = require('../services/userService');


const getUsers = (request, response) => {
  const { token } = request.body;

  fetchUsers(
    token,
    (rows) => response.status(200).json(rows),
    (message) => response.status(403).send(message),
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);
  const { token } = request.body;

  fetchUserById(
    token,
    id,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const getUserByUsername = (request, response) => {
  const {
    token, username,
  } = request.body;

  fetchUserByUsername(
    token,
    username,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const getUserByEmail = (request, response) => {
  const {
    token, email,
  } = request.body;

  fetchUserByEmail(
    token,
    email,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const createUser = (request, response) => {
  const {
    user, token,
  } = request.body;

  insertUser(
    token,
    user,
    (answer) => response.status(201).send(answer),
    (message) => response.status(403).send(message),
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    user, token,
  } = request.body;

  patchUser(
    token,
    id,
    user,
    (answer) => response.status(204).send(answer),
    (message) => response.status(403).send(message),
  );
};

const deleteUserById = (request, response) => {
  const id = parseInt(request.params.id);
  const { token } = request.body;

  removeUserById(
    token,
    id,
    (answer) => response.status(202).send(answer),
    (message) => response.status(403).send(message),
  );
};

module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUserById,
};