const app = require('express');
const router = app.Router();
const { login } = require('../controllers/userController');

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

router.post('/', login);

module.exports = router;