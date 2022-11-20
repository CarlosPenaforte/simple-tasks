import {
  Request, Response,
} from 'express';
import { authenticateUser } from '../services/loginService';

export const login = async (request: Request, response: Response): Promise<void> => {
  const {
    email, password,
  } = request.body;

  await authenticateUser(email, password, (user) => {
    response.status(200).json(user);
  }, (message) => {
    console.log(message);
    response.status(403).send(message);
  }, (toTranslate: string) => request.t(toTranslate),
  );
};