const app = require('express');
const router = app.Router();
const userController = require('../controllers/userController');

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

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUserById);

module.exports = router;