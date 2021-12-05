"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.NotImplementedError = exports.InternalServerError = exports.NotFoundError = exports.BadRequestError = exports.ExtendedError = void 0;
const httpStatus = __importStar(require("http-status"));
const typescript_rest_1 = require("typescript-rest");
class ExtendedError extends typescript_rest_1.Errors.HttpError {
    constructor(name, statusCode, description, info, body) {
        super(name, statusCode);
        this.info = info;
        this.body = body;
    }
}
exports.ExtendedError = ExtendedError;
class BadRequestError extends ExtendedError {
    constructor({ description, info, body }) {
        super('BadRequestError', httpStatus[400], description, info, body);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ExtendedError {
    constructor({ description, info, body }) {
        super('NotFoundError', httpStatus[400], description, info, body);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends ExtendedError {
    constructor({ description, info, body }) {
        super('InternalServerError', httpStatus[500], description, info, body);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}
exports.InternalServerError = InternalServerError;
class NotImplementedError extends ExtendedError {
    constructor({ description, info, body }) {
        super('NotImplementedError', httpStatus[501], description, info, body);
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}
exports.NotImplementedError = NotImplementedError;
class UnauthorizedError extends ExtendedError {
    constructor({ description, info, body }) {
        super('UnauthorizedError', httpStatus[401], description, info, body);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=error.js.map