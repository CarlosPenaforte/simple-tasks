const { authenticateUser } = require('../services/loginService');

const login = (request, response) => {
  const {
    email, password,
  } = request.body;

  authenticateUser(email, password, (user) => {
    console.log(user);
    response.status(200).json(user);
  }, (message) => {
    console.log(message);
    response.status(403).send(message);
  });
};

module.exports = {
  login,
};