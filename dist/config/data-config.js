"use strict";
const pg_1 = require("pg");
const apiConfig = require('../config/api-config');
const pool = new pg_1.Pool({
    host: apiConfig.dataSources.connectionString,
    user: apiConfig.dataSources.user,
    password: apiConfig.dataSources.password,
    database: apiConfig.dataSources.database
});
module.exports = pool;
//# sourceMappingURL=data-config.js.map