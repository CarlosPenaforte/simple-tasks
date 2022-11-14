const Pool = require('workerpool').pool({ maxQueueSize: parseInt(process.env.MAX_QUEUE) });

const execute = (func, ...args) => {
  Pool.exec(func, [...args])
    .then(() => Pool.terminate());
};

module.exports = {
  execute,
};