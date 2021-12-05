"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasourceConfig = void 0;
class DatasourceConfig {
    constructor(source) {
        this.name = '';
        this.database = '';
        this.host = '';
        this.port = 0;
        this.username = '';
        // eslint-disable-next-line no-use-before-define
        this.dialect = 'postgres';
        if (source) {
            this.name = source.name;
            this.database = source.database;
            this.host = source.host;
            this.port = source.port;
            this.username = source.username;
            this.dialect = source.dialect;
        }
    }
}
exports.DatasourceConfig = DatasourceConfig;
//# sourceMappingURL=DatasourceConfig.js.map