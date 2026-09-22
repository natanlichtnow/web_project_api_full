const CustomError = require('./CustomError');
const { BAD_REQUEST } = require('../utils/errors');

class BadRequestError extends CustomError {
  constructor(message = 'Dados invÃ¡lidos') {
    super(message, BAD_REQUEST);
  }
}

module.exports = BadRequestError;
