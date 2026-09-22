const { INTERNAL_SERVER_ERROR } = require('../utils/errors');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).json({
    message: statusCode === INTERNAL_SERVER_ERROR
      ? 'Ocorreu um erro no servidor'
      : message,
  });
};
