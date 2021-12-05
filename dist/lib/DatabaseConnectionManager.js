"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionManager = void 0;
const pg_1 = require("pg");
const error_1 = require("./error");
const AWS = require('aws-sdk');
const NodeCache = require('node-cache');
const connectionsCache = new NodeCache({ stdTTL: 120, checkperiod: 15 });
class DatabaseConnectionManager {
    constructor() { }
    /**
       *
       * Establishes a database connection from the connection pool. First it attempts to do so
       * from a cached instance of the pool otherwise fetches from PG helper.
       *
       */
    getDbConnection(sqlOperation, datasourceConfig, secretsConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getConnectionPoolConfigAsync(sqlOperation, datasourceConfig, secretsConfig).then((connPool) => {
                    return connPool.connect();
                });
            }
            catch (e) {
                connectionsCache.flushAll();
                throw new error_1.DatabaseConnectionError('Problem establishing database connection', e);
            }
        });
    }
    /**
       *
       * Fetches a connection from the PG helper with the proviced credentials.
       *
       */
    getConnectionPoolConfigAsync(sqlOperation, config, secretsConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionPool = connectionsCache.get(`${config.name}_${sqlOperation}`);
            if (connectionPool) {
                return connectionPool;
            }
            else {
                return this.getPoolConfiguration(sqlOperation, config, secretsConfig).then((poolConfig) => {
                    const pool = new pg_1.Pool(poolConfig);
                    connectionsCache.set(`${config.name}_${sqlOperation}`, pool);
                    return pool;
                });
            }
        });
    }
    /*
      * Retrieve the Connection information from AWS secret manager.
      */
    getPoolConfiguration(sqlOperation, config, awsConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                SecretId: process.env.DB_SECRET,
                VersionStage: 'AWSCURRENT'
            };
            const secretsmanager = new AWS.SecretsManager(awsConfig);
            const awspromise = yield secretsmanager.getSecretValue(params).promise();
            const output = JSON.parse(awspromise.SecretString);
            return {
                user: output.username,
                password: output.password,
                port: output.port,
                host: sqlOperation === 'Read' ? output.hostReadOnly : output.host,
                database: config.database
            };
        });
    }
}
exports.DatabaseConnectionManager = DatabaseConnectionManager;
//# sourceMappingURL=DatabaseConnectionManager.js.map