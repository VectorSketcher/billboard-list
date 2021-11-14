"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const http_1 = require("http");
const app_1 = require("./app");
debug('ts-express:server');
app_1.default.set('port', 2000);
const server = (0, http_1.createServer)(app_1.default);
server.listen(2000);
server.on('listening', onListening);
function onListening() {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    app_1.default.listen(console.log(`Server is listening on port ${bind}`));
}
//# sourceMappingURL=index.js.map