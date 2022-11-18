import {
  Request, Response,
} from 'express';
/* eslint-disable no-unused-vars */
import {
  fetchUsers,
  fetchUserById,
  fetchUserByUsername,
  fetchUserByEmail,
  insertUser,
  patchUser,
  removeUserById,
} from '../services/userService';


export const getUsers = async (request: Request, response: Response): Promise<void> => {
  const { token } = request.body;

  await fetchUsers(
    token,
    (rows: object) => response.status(200).json(rows),
    (message: string | object) => response.status(403).send(message),
  );
};

export const getUserById = async (request: Request, response: Response): Promise<void> => {
  const id: number = parseInt(request.params.id);
  const { token } = request.body;

  await fetchUserById(
    token,
    id,
    (user: object) => response.status(200).json(user),
    (message: string | object) => response.status(403).send(message),
  );
};

export const getUserByUsername = async (request: Request, response: Response): Promise<void> => {
  const {
    token, username,
  } = request.body;

  await fetchUserByUsername(
    token,
    username,
    (user: object) => response.status(200).json(user),
    (message: string | object) => response.status(403).send(message),
  );
};

export const getUserByEmail = async (request: Request, response: Response): Promise<void> => {
  const {
    token, email,
  } = request.body;

  await fetchUserByEmail(
    token,
    email,
    (user: object) => response.status(200).json(user),
    (message: string | object) => response.status(403).send(message),
  );
};

export const createUser = async (request: Request, response: Response): Promise<void> => {
  const {
    user, token,
  } = request.body;

  await insertUser(
    token,
    user,
    (answer: string | object) => response.status(201).send(answer),
    (message: string | object) => response.status(403).send(message),
  );
};

export const updateUser = async (request: Request, response: Response): Promise<void> => {
  const id: number = parseInt(request.params.id);
  const {
    user, token,
  } = request.body;

  await patchUser(
    token,
    id,
    user,
    (answer: string | object) => response.status(204).send(answer),
    (message: string | object) => response.status(403).send(message),
  );
};

export const deleteUserById = async (request: Request, response: Response): Promise<void> => {
  const id: number = parseInt(request.params.id);
  const { token } = request.body;

  await removeUserById(
    token,
    id,
    (answer: string | object) => response.status(202).send(answer),
    (message: string | object) => response.status(403).send(message),
  );
};