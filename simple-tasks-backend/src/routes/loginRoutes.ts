import app, {
  NextFunction, Request, Response, Router,
} from 'express';
const router: Router = app.Router();
import { login } from '../controllers/loginController';

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    new Date(Date.now()).toLocaleTimeString()
      + ': Executing method '
      + req.method
      + ' on '
      + req.originalUrl,
  );
  next();
});


router.post('/', login);

export default router;