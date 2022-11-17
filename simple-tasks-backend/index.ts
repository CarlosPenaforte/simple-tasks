// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port = process.env.PORT;

import express from 'express';
import bodyParser from 'body-parser';
const app = express();
import corsMiddleware from './src/config/cors';
import rateLimiter from './src/config/rateLimiter';

import userRoutes from './src/routes/userRoutes';
import loginRoutes from './src/routes/loginRoutes';

import migrate from './src/migrations';

migrate().then(() => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  app.use(corsMiddleware);
  app.use(rateLimiter);

  app.listen(port, () => {
    console.log(`App running on port ${port}.`);
  });

  app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
  });

  app.use('/api/v1/users', userRoutes);

  app.use('/login', loginRoutes);
});