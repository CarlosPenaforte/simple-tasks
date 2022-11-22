import express, {
  NextFunction, Request, Response,
} from 'express';
const router = express.Router();

import {
  getTasks, getSharedTasks, getSingleTask, createTask, updateTask, deleteTask,
} from '../controllers/taskController';

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.t('SYSTEM.EXECUTING_METHOD', {
    time: new Date(Date.now()).toLocaleTimeString(),
    method: req.method,
    url: req.originalUrl,
  }));
  next();
});

router.get('/:id', getTasks);
router.get('/shared/:id', getSharedTasks);
router.get('/single/:id', getSingleTask);
router.post('/', createTask);
router.put('/single/:id', updateTask);
router.delete('/single/:id', deleteTask);

export default router;