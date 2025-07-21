module.exports = {
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  },

  MESSAGES: {
    OK: "Request successful",
    CREATED: "Resource created successfully",
    BAD_REQUEST: "Bad request",
    UNAUTHORIZED: "Incorrect email or password",
    FORBIDDEN: "You do not have permission to perform this action",
    NOT_FOUND: "Resource not found",
    CONFLICT: "A resource with the provided information already exists",
    SERVER_ERROR: "Internal server error",
  },
};
