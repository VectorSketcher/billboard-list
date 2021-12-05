export class DatasourceConfig {
    name: string = '';
    database: string = '';
    host: string = '';
    port: number = 0;
    username: string = '';
    // eslint-disable-next-line no-use-before-define
    dialect: DatabaseDialect = 'postgres';

    constructor(source: any) {
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

export type DatabaseDialect = 'postgres' | 'mysql';
