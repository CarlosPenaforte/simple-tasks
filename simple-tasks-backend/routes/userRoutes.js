const app = require('express');
const router = app.Router();
const userService = require('../services/userService');

router.use((req, res, next) => {
  console.log(new Date(Date.now()).toLocaleString()+': Executing method '+ req.method + ' on ' + req.originalUrl);
  next();
});

router.get('/', userService.getUsers );
router.get('/:id', userService.getUserById);
router.post('/', userService.createUser);
router.put('/:id', userService.updateUser);
router.delete('/:id', userService.deleteUserById);

module.exports = router;