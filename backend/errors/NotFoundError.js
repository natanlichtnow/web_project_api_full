const CustomError = require('./CustomError');
const { NOT_FOUND } = require('../utils/errors');

class NotFoundError extends CustomError {
  constructor(message = 'Recurso nÃ£o encontrado') {
    super(message, NOT_FOUND);
  }
}

module.exports = NotFoundError;
