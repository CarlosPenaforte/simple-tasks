const app = require('express');
const router = app.Router();
const { login } = require('../controllers/loginController');
const { loginCors } = require('../config/cors');

router.use((req, res, next) => {
  console.log(
    new Date(Date.now()).toLocaleTimeString()
      + ': Executing method '
      + req.method
      + ' on '
      + req.originalUrl,
  );
  next();
});

router.options('/', loginCors);

router.post('/', loginCors, login);

module.exports = router;