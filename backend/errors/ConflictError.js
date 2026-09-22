const CustomError = require('./CustomError');
const { CONFLICT } = require('../utils/errors');

class ConflictError extends CustomError {
  constructor(message = 'Conflito de dados') {
    super(message, CONFLICT);
  }
}

module.exports = ConflictError;
