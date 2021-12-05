"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    max: 20,
    connectionString: 'postgres://cgcwzwjn:xeyRR-pIGARB413PtO1Ptjt2lXTYENlu@kashin.db.elephantsql.com/cgcwzwjn',
    idleTimeoutMillis: 30000
});
exports.default = pool;
//# sourceMappingURL=dbconnector.js.map