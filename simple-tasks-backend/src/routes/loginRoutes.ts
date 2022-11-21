import app, {
  NextFunction, Request, Response, Router,
} from 'express';
const router: Router = app.Router();
import { login } from '../controllers/loginController';

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.t('SYSTEM.EXECUTING_METHOD', {
    time: new Date(Date.now()).toLocaleTimeString(),
    method: req.method,
    url: req.originalUrl,
  }));
  next();
});


router.post('/', login);

export default router;