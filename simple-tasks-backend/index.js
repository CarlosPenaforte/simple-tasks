require('dotenv').config();
const port = process.env.PORT;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('./config/cors');
const rateLimiter = require('./config/rateLimiter');

const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors);
app.use(rateLimiter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.use('/api/v1/users', userRoutes);

app.use('/login', loginRoutes);
