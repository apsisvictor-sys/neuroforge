import { AppError } from "./app-error.ts";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super({
      message,
      code: "NOT_FOUND",
      httpStatus: 404,
      expose: true
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super({
      message,
      code: "UNAUTHORIZED",
      httpStatus: 401,
      expose: true
    });
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super({
      message,
      code: "VALIDATION_ERROR",
      httpStatus: 400,
      expose: true
    });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super({
      message,
      code: "CONFLICT",
      httpStatus: 409,
      expose: true
    });
  }
}
