const { STATUS_CODES, ERROR_MESSAGES } = require('./constants');

class BadRequestError extends Error {
  constructor(message = ERROR_MESSAGES.BAD_REQUEST) {
    super(message);
    this.statusCode = STATUS_CODES.BAD_REQUEST;
  }
}

class UnauthorizedError extends Error {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message);
    this.statusCode = STATUS_CODES.UNAUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message = ERROR_MESSAGES.FORBIDDEN) {
    super(message);
    this.statusCode = STATUS_CODES.FORBIDDEN;
  }
}

class NotFoundError extends Error {
  constructor(message = ERROR_MESSAGES.NOT_FOUND) {
    super(message);
    this.statusCode = STATUS_CODES.NOT_FOUND;
  }
}

class ConflictError extends Error {
  constructor(message = ERROR_MESSAGES.CONFLICT) {
    super(message);
    this.statusCode = STATUS_CODES.CONFLICT;
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};

