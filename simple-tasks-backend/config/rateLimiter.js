const { RateLimiterPostgres } = require('rate-limiter-flexible');
const { pool } = require('./pg');

const options = {
  storeClient: pool,
  duration: parseInt(process.env.MAX_REQUEST_WINDOW),
  points: parseInt(process.env.MAX_REQUEST_LIMIT),

  tableName: 'rateLimiters',
  keyPrefix: 'general',
};

const rateLimiter = new RateLimiterPostgres(options);

module.exports = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ message: process.env.TOO_MANY_REQUESTS_MESSAGE });
    });
};