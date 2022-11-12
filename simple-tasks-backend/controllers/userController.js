/* eslint-disable no-unused-vars */
const { request } = require('express');
const {
  fetchUsers,
  fetchUserById,
  fetchUserByUsername,
  fetchUserByEmail,
  insertUser,
  patchUser,
  removeUserById,
  authenticateUser,
} = require('../services/userService');


const getUsers = (request, response) => {
  fetchUsers(
    (rows) => response.status(200).json(rows),
    (message) => response.status(403).send(message),
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  fetchUserById(
    id,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const getUserByUsername = (request, response) => {
  const username = parseInt(request.params.username);

  fetchUserByUsername(
    username,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const getUserByEmail = (request, response) => {
  const email = parseInt(request.params.email);

  fetchUserByEmail(
    email,
    (user) => response.status(200).json(user),
    (message) => response.status(403).send(message),
  );
};

const createUser = (request, response) => {
  const user = request.body;

  insertUser(
    user,
    (answer) => response.status(201).send(answer),
    (message) => response.status(403).send(message),
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const user = request.body;

  patchUser(
    id,
    user,
    (answer) => response.status(204).send(answer),
    (message) => response.status(403).send(message),
  );
};

const deleteUserById = (request, response) => {
  const id = parseInt(request.params.id);

  removeUserById(
    id,
    (answer) => response.status(202).send(answer),
    (message) => response.status(403).send(message),
  );
};

const login = (request, response) => {
  const {
    email, password,
  } = request.body;

  authenticateUser(email, password, (user) => {
    console.log(user);
    response.status(200).json(user);
  }, (message) => {
    console.log(message);
    response.status(403).send(message);
  });
};

module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUserById,
  login,
};