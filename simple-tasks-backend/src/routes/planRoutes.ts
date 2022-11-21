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
router.get('/:title', getPlanByTitle);
router.get('/userplans/:id', getUserPlanByUserId);
router.post('/userplans', createUserPlan);
router.put('/userplans', updateUserPlan);
router.delete('/userplans/:id', deactivateUserPlanByUserId);

export default router;