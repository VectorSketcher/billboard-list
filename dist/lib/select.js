"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = exports.selectQuery = void 0;
const sql_tag_1 = require("../lib/sql-tag");
const snakeToCamel = (s) => s.replace(/_(.)/g, (m, c) => c.toUpperCase());
const camelToSnake = (s) => s.replace(/([a-z])([^a-z])/g, (m, c1, c2) => `${c1}_${c2.toLowerCase()}`);
function selectQuery(filterAndOrder, selectParams, filterParams, orderParams, pagingParams) {
    let filter;
    let select;
    let order;
    if (filterParams) {
        Object.keys(filterParams).forEach(key => {
            if (!filterParams[key]) {
                delete filterParams[key];
            }
        });
        filter = this.fieldsEqualValuesCustom(filterParams);
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
exports.selectQuery = selectQuery;
function select(filterAndOrder, selectParams, filterParams, orderParams, pagingParams) {
    const query = this.selectQuery(filterAndOrder, selectParams, filterParams, orderParams, pagingParams);
    return this.executeAndMap(query);
}
exports.select = select;
//# sourceMappingURL=select.js.map