"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
debug('ts-express:server');
app_1.default.set('port', 2000);
const server = (0, http_1.createServer)(app_1.default);
/* const server = createServer((req, res) => {
  console.log('request url', req.url);
  console.log('request method', req.method);
  res.setHeader('Content-Type', 'text/html');
  res.end();
}); */
server.listen(2000);
server.on('listening', onListening);
function onListening() {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    app_1.default.listen(console.log(`Server is listening on port ${bind}`));
}
//# sourceMappingURL=index.js.map