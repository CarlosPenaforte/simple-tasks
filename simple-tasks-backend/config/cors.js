const cors = require('cors');

// TO-DO
// const whitelist = [ 'http://developer1.com', 'http://developer2.com' ];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error());
//     }
//   },
// };

const userCorsOptions = {
  origin: '*',
  methods: process.env.USER_METHODS,
  credentials: true,
  allowedHeaders: [
    'Content-Type', 'Access-Control-Allow-Origin', 'Origin', 'Accept',
  ],
};
const userCors = cors(userCorsOptions);

const loginCorsOptions = {
  origin: '*',
  methods: process.env.LOGIN_METHODS,
  credentials: true,
  allowedHeaders: [
    'Content-Type', 'Access-Control-Allow-Origin', 'Origin', 'Accept',
  ],
};
const loginCors = cors(loginCorsOptions);

module.exports = {
  userCors,
  loginCors,
};