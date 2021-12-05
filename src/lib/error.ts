export class DatabaseConnectionError implements Error {
    name: string;

    constructor(public message: string, public stack: string) {
      this.name = 'DatabaseConnectionError';
    }
}

export class DatabaseReadError implements Error {
    name: string;

    constructor(public message: string, public stack: string) {
      this.name = 'DatabaseReadError';
    }
}

export class DatabaseWriteError implements Error {
    name: string;

    constructor(public message: string, public stack: string) {
      this.name = 'DatabaseWriteError';
    }
}

export class DatasourceConfigurationError implements Error {
    name: string;

    constructor(public message: string, public stack: string) {
      this.name = 'DatasourceConfigurationError';
    }
}
