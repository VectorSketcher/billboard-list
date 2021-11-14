
import debug = require('debug');
import { createServer } from 'http';
import App from './app';

debug('ts-express:server');

App.set('port', 2000);
const server = createServer(App);
server.listen(2000);
server.on('listening', onListening);

function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  App.listen(console.log(`Server is listening on port ${bind}`));
}
