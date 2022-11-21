import express, {
  NextFunction, Request, Response,
} from 'express';
const router = express.Router();

import {
  getUsers, getUserById, createUser, updateUser, deleteUserById,
} from '../controllers/userController';

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.t('SYSTEM.EXECUTING_METHOD', {
    time: new Date(Date.now()).toLocaleTimeString(),
    method: req.method,
    url: req.originalUrl,
  }));
  next();
});

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUserById);

export default router;