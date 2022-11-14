const express = require('express');
const router = express.Router();
const { userCors } = require('../config/cors');

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
} = require('../controllers/userController');

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

router.options('/', userCors);
router.options('/:id', userCors);

router.get('/', userCors, getUsers);
router.get('/:id', userCors, getUserById);
router.post('/', userCors, createUser);
router.put('/:id', userCors, updateUser);
router.delete('/:id', userCors, deleteUserById);

module.exports = router;