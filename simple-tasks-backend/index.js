if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;

const userServices = require('./services/userService');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.get('/api/v1/users', userServices.getUsers );
app.get('/api/v1/users/:id', userServices.getUserById);
app.post('/api/v1/users', userServices.createUser);
