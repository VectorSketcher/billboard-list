import * as httpStatus from 'http-status';
import { Errors } from 'typescript-rest';

export abstract class ExtendedError extends Errors.HttpError {
  constructor(
    name: string,
    statusCode: string,
    description: string,
        public info?: string,
        public body?: any
  ) {
    super(name, statusCode);
  }
}

interface ErrorParams {
    description: string;
    info?: string;
    body?: any;
}

export class BadRequestError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super('BadRequestError', httpStatus[400], description, info, body);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class NotFoundError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super('NotFoundError', httpStatus[400], description, info, body);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InternalServerError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super('InternalServerError', httpStatus[500], description, info, body);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class NotImplementedError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super('NotImplementedError', httpStatus[501], description, info, body);
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}

export class UnauthorizedError extends ExtendedError {
  constructor({ description, info, body }: ErrorParams) {
    super('UnauthorizedError', httpStatus[401], description, info, body);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
