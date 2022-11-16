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


const getUsers = async (request, response) => {
  const { token } = request.body;

  await fetchUsers(
    token,
    (rows) => response.status(200).json(rows),
    (message) => response.status(403).send(message),
  );
};

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  const { token } = request.body;

  await fetchUserById(
    token,
    id,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const getUserByUsername = async (request, response) => {
  const {
    token, username,
  } = request.body;

  await fetchUserByUsername(
    token,
    username,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const getUserByEmail = async (request, response) => {
  const {
    token, email,
  } = request.body;

  await fetchUserByEmail(
    token,
    email,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const createUser = async (request, response) => {
  const {
    user, token,
  } = request.body;

  await insertUser(
    token,
    user,
    (answer) => response.status(201).send(answer),
    (message) => response.status(403).send(message),
  );
};

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const {
    user, token,
  } = request.body;

  await patchUser(
    token,
    id,
    user,
    (answer) => response.status(204).send(answer),
    (message) => response.status(403).send(message),
  );
};

const deleteUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  const { token } = request.body;

  await removeUserById(
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