const cors = require('cors');

const whitelist = [
  'http://localhost:8000', 'http://localhost:3000', 'http://localhost:8080',
];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

module.exports = cors(corsOptionsDelegate);