
import express = require('express');
import { Server } from 'typescript-rest';
import UsersRouter from './routes/UsersRouter';

// creates swagger documentation
// eslint-disable-next-line one-var
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('../swagger.json');
const basePath = '/';
class App {
    // ref to Express instance
    public app: express.Application;

    // Run configuration methods on the Express instance.
    constructor() {
      this.app = express();
      this.swagger();
      this.config();
    }

    // grabs data from routers and reads it
    private config(): void {
      const router = express.Router();
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(express.json());
      Server.buildServices(router, UsersRouter);
      this.app.use(basePath, router);
    }

    // Configure Swagger
    private swagger(): void {
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
}

export default new App().app;
