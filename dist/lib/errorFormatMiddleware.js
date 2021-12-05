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
const httpStatus = __importStar(require("http-status"));
const typescript_rest_1 = require("typescript-rest");
const error_1 = require("../types/error");
function errorFormatMiddleware(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof typescript_rest_1.Errors.HttpError) {
        const errorBody = {
            description: err.message
        };
        if (err instanceof error_1.ExtendedError) {
            Object.assign(errorBody, {
                info: err.statusCode,
                body: err.message
            });
        }
        res.status(err.statusCode).json(errorBody);
    }
    else {
        const errorBody = {
            description: err.message,
            body: err.stack
        };
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorBody);
    }
}
exports.default = errorFormatMiddleware;
//# sourceMappingURL=errorFormatMiddleware.js.map