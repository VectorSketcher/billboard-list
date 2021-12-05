"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasourceConfigurationError = exports.DatabaseWriteError = exports.DatabaseReadError = exports.DatabaseConnectionError = void 0;
class DatabaseConnectionError {
    constructor(message, stack) {
        this.message = message;
        this.stack = stack;
        this.name = 'DatabaseConnectionError';
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
class DatabaseReadError {
    constructor(message, stack) {
        this.message = message;
        this.stack = stack;
        this.name = 'DatabaseReadError';
    }
}
exports.DatabaseReadError = DatabaseReadError;
class DatabaseWriteError {
    constructor(message, stack) {
        this.message = message;
        this.stack = stack;
        this.name = 'DatabaseWriteError';
    }
}
exports.DatabaseWriteError = DatabaseWriteError;
class DatasourceConfigurationError {
    constructor(message, stack) {
        this.message = message;
        this.stack = stack;
        this.name = 'DatasourceConfigurationError';
    }
}
exports.DatasourceConfigurationError = DatasourceConfigurationError;
//# sourceMappingURL=error.js.map