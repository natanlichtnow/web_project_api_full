const CustomError = require('./CustomError');
const { FORBIDDEN } = require('../utils/errors');

class ForbiddenError extends CustomError {
  constructor(message = 'Acesso negado') {
    super(message, FORBIDDEN);
  }
}

module.exports = ForbiddenError;
