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
exports.BasePostgresDataManager = void 0;
/* eslint-disable no-useless-catch */
/* eslint-disable new-cap */
const sql_tag_1 = __importStar(require("./sql-tag"));
const error_1 = require("./error");
const DatabaseConnectionManager_1 = require("./DatabaseConnectionManager");
// Don't parse dates into `Date` objects; keep as string
// const PG_DATE_OID = 1082;
// types.setTypeParser(PG_DATE_OID, v => v);
const snakeToCamel = (s) => s.replace(/_(.)/g, (m, c) => c.toUpperCase());
const camelToSnake = (s) => s.replace(/([a-z])([^a-z])/g, (m, c1, c2) => `${c1}_${c2.toLowerCase()}`);
class BasePostgresDataManager {
    constructor(tConstructor) {
        this.tConstructor = tConstructor;
        // TODO: add logging support
        // protected abstract logger?: Logger;
        // TODO: do we need to check the type of the value? i.e. don't include functions
        this.fieldMap = new Map(Object.keys(new this.tConstructor({})).map(k => [k, camelToSnake(k)]));
        /**
         * A comma-separated list of the database columns for this table
         * Useful in SELECT and INSERT clauses
         */
        this.fields = Array.from(this.fieldMap.values()).join(', ');
        /**
         * A comma-separated list of the database columns for this table with AS statements mapping to camelCase names
         * Useful in RETURNING clauses
         */
        this.fieldsAsCamel = Array.from(this.fieldMap.entries()).map(e => `${e[1]} AS "${e[0]}"`).join(', ');
        this.connectionManager = new DatabaseConnectionManager_1.DatabaseConnectionManager();
    }
    /**
     * Get a comma-separated list of an object's values, in parameterized QueryConfig format and in the same order as `this.fields`
     * Useful in the VALUES clause of an INSERT statement
     * @param t
     */
    values(t) {
        const vals = Array.from(this.fieldMap.keys()).map(k => (0, sql_tag_1.default) `${t[k]}`);
        return (0, sql_tag_1.joinSql)(vals, ', ');
    }
    /**
     * Get a comma-separated list of field value assignments, in parameterized QueryConfig format
     * Useful in the SET clause of an UPDATE statement
     * @param t
     */
    fieldsEqualValues(t) {
        const vals = Array.from(this.fieldMap.entries())
            .filter(e => t[e[0]] !== undefined)
            .map(e => (0, sql_tag_1.concatSql)(`${e[1]} =`, (0, sql_tag_1.default) `${t[e[0]]}`));
        return (0, sql_tag_1.joinSql)(vals, ', ');
    }
    /**
     * Get a client from the pool
     */
    getClient(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlOperation = query.text.search(/select/i) === 0 ? 'Read' : 'Write';
            try {
                return yield this.connectionManager.getDbConnection(sqlOperation, this.getDatabaseConfigurations(), this.getAwsConfiguration());
            }
            catch (e) {
                throw new error_1.DatabaseConnectionError('Error getting client database connection', e);
            }
        });
    }
    /**
     * Execute a query and release the client back to the pool
     * @param query
     */
    execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient(query);
            try {
                return yield client.query(query);
            }
            catch (e) {
                // TODO: throw a custom error or just pass it on?
                // logger.error(e);
                // throw new InternalServerError({ description: 'Error querying database', body: e.stack });
                throw e;
            }
            finally {
                client.release(new Error());
            }
        });
    }
    /**
     * Execute a query and map the returned rows to T
     * @param query
     */
    executeAndMap(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.execute(query);
            return result.rows.map(r => new this.tConstructor(r));
        });
    }
    /**
     * Test the database connection and existence of the table
     */
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, sql_tag_1.concatSql)(`SELECT NOW() FROM ${this.tableName} LIMIT 1`);
            yield this.execute(query);
            return true;
        });
    }
    // -------------------------------------------------------------------------
    // Convenience helpers for simple queries
    // Potential improvement: generate WHERE clause given an object.
    //      - could constrain keys
    //      - would only work for equality though
    // -------------------------------------------------------------------------
    /**
     * Construct a query to count records
     * @param where
     */
    countQuery(where) {
        return (0, sql_tag_1.concatSql)(`SELECT COUNT(*) FROM ${this.tableName}`, where);
    }
    /**
     * Count the number of records in the database table
     * @param where
     */
    count(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.countQuery(where);
            const result = yield this.execute(query);
            // node-postgres keeps COUNT() value a string because it's an int8 and JS can't handle 64-bit numbers. parsing it anyway for now...
            return parseInt(result.rows[0].count, 10);
        });
    }
    /**
     * Construct a query to select records
     * @param filterAndOrder
     * @param selectParams
     * @param filterParams
     * @param orderParams
     * @param pagingParams
     */
    selectQuery(filterAndOrder, selectParams, filterParams, orderParams, pagingParams) {
        let filter;
        let select;
        let order;
        if (filterParams) {
            Object.keys(filterParams).forEach(key => {
                if (!filterParams[key]) {
                    delete filterParams[key];
                }
            });
            if (orderParams) {
                const fieldMap = Object.keys(orderParams).map(k => [k, camelToSnake(k), orderParams[k]]);
                order = fieldMap.map(e => `${e[1]} ${e[2]}`).join(', ');
            }
        }
        filterAndOrder = (0, sql_tag_1.concatSql)(!!filter && 'WHERE', !!filter && filter, !!filterAndOrder && filterAndOrder, !!order && 'ORDER BY', !!order && order, !!pagingParams && `LIMIT ${pagingParams.limit} OFFSET ${pagingParams.offset}`);
        if (selectParams) {
            const fieldMap = Object.keys(selectParams).map(k => [k, camelToSnake(k)]);
            select = fieldMap.map(e => `${e[1]} AS "${e[0]}"`).join(', ');
        }
        return (0, sql_tag_1.concatSql)(`SELECT ${select || this.fieldsAsCamel} FROM ${this.tableName}`, filterAndOrder);
    }
    /**
     * Select records
     * @param filterAndOrder may include WHERE, ORDER, LIMIT and OFFSET clauses
     */
    select(filterAndOrder, selectParams, filterParams, orderParams, pagingParams) {
        const query = this.selectQuery(filterAndOrder, selectParams, filterParams, orderParams, pagingParams);
        return this.executeAndMap(query);
    }
    /**
     * Construct a query to insert records
     * @param obj
     */
    insertQuery(...objs) {
        return (0, sql_tag_1.concatSql)(`INSERT INTO ${this.tableName} (${this.fields}) VALUES`, ...objs.map((obj, i, arr) => (0, sql_tag_1.concatSql)('(', this.values(obj), i < arr.length - 1 ? '),' : ')')), `RETURNING ${this.fieldsAsCamel}`);
    }
    /**
     * Insert and return records
     * @param obj
     */
    insert(...objs) {
        const query = this.insertQuery(...objs);
        return this.executeAndMap(query);
    }
    /**
     * Construct a query to update records
     * @param obj
     * @param where
     * @param returnFields
     */
    updateQuery(obj, where, returnFields) {
        let returnClause = `RETURNING ${this.fieldsAsCamel}`;
        if (!!returnFields && Object.keys(returnFields).length > 0) {
            const fieldMap = Object.keys(returnFields).map(k => [k, camelToSnake(k)]);
            const fieldString = fieldMap.map(e => `${e[1]} AS "${e[0]}"`).join(', ');
            returnClause = `RETURNING ${fieldString}`;
        }
        return (0, sql_tag_1.concatSql)(`UPDATE ${this.tableName} SET`, this.fieldsEqualValues(obj), where, returnClause);
    }
    /**
     * Update and return records
     * @param obj
     * @param where
     * @param returnFields
     */
    update(obj, where, returnFields) {
        const query = this.updateQuery(obj, where, returnFields);
        return this.executeAndMap(query);
    }
    /**
     * Construct a query to delete records
     * @param where
     */
    deleteQuery(where) {
        return (0, sql_tag_1.concatSql)(`DELETE FROM ${this.tableName}`, where, `RETURNING ${this.fieldsAsCamel}`);
    }
    /**
     * Delete and return records
     * @param where
     */
    delete(where) {
        const query = this.deleteQuery(where);
        return this.executeAndMap(query);
    }
}
exports.BasePostgresDataManager = BasePostgresDataManager;
//# sourceMappingURL=BasePostgresDataManager.js.map