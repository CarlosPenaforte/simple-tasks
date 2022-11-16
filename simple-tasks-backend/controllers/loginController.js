const { authenticateUser } = require('../services/loginService');

const login = async (request, response) => {
  const {
    email, password,
  } = request.body;

  await authenticateUser(email, password, (user) => {
    response.status(200).json(user);
  }, (message) => {
    console.log(message);
    response.status(403).send(message);
  });
};

module.exports = {
  login,
};