import express, {
  NextFunction, Request, Response,
} from 'express';
const router = express.Router();

import {
  getPlans, getPlanByTitle, getUserPlanByUserId, createUserPlan, updateUserPlan, deactivateUserPlanByUserId,
} from '../controllers/planController';

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.t('SYSTEM.EXECUTING_METHOD', {
    time: new Date(Date.now()).toLocaleTimeString(),
    method: req.method,
    url: req.originalUrl,
  }));
  next();
});

router.get('/', getPlans);
router.get('/title=:title', getPlanByTitle);
router.get('/user-id=:id', getUserPlanByUserId);
router.post('/', createUserPlan);
router.put('/', updateUserPlan);
router.delete('/:id', deactivateUserPlanByUserId);

export default router;