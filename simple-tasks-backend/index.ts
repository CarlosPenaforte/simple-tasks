// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const port = process.env.PORT;

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import corsMiddleware from './src/config/cors';
import rateLimiter from './src/config/rateLimiter';

import userRoutes from './src/routes/userRoutes';
import loginRoutes from './src/routes/loginRoutes';

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

import migrate from './src/migrations';

migrate().then(() => {
  i18next.use(Backend).use(middleware.LanguageDetector).init({
    backend: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
    },
    preload: [ 'en-US', 'pt-BR' ],
    fallbackLng: 'en-US',
    supportedLngs: [ 'en-US', 'pt-BR' ],
  });

  const app: Application = express();

  app.use(
    middleware.handle(i18next),
  );

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
    response.json({ info: request.t('INFO') });
  });

  app.use('/api/v1/users', userRoutes);

  app.use('/login', loginRoutes);
});