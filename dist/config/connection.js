"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("./pool"));
exports.default = {
    /**
      *  Query DB
      * @param {object} req
      * @param {object} res
      * @returns {object} object
      */
    query(queryText, params) {
        return new Promise((resolve, reject) => {
            pool_1.default.query(queryText, params)
                .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
//# sourceMappingURL=connection.js.map