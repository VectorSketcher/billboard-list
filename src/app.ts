
import cors = require('cors');
import express = require('express');
import { Server } from 'typescript-rest';
import TopOneHundredRouter from './routes/TopOneHundredRouter';
import errorFormatMiddleware from './lib/errorFormatMiddleware';
const bodyParser = require('body-parser');

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
    this.app.use(cors);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.text());
    this.handleErrors();
  }

  // grabs data from routers and reads it
  private config(): void {
    const router = express.Router();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    Server.buildServices(router, TopOneHundredRouter);
    this.app.use(basePath, router);
  }

  private handleErrors(): void {
    this.app.use(errorFormatMiddleware);
  }

  // Configure Swagger
  private swagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

export default new App().app;
