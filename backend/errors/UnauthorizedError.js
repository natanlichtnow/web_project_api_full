const CustomError = require('./CustomError');
const { UNAUTHORIZED } = require('../utils/errors');

class UnauthorizedError extends CustomError {
  constructor(message = 'AutorizaÃ§Ã£o necessÃ¡ria') {
    super(message, UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
