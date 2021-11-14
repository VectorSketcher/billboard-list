"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const typescript_rest_1 = require("typescript-rest");
const UsersRouter_1 = require("./routes/UsersRouter");
// creates swagger documentation
// eslint-disable-next-line one-var
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('../swagger.json');
const basePath = '/';
class App {
    // Run configuration methods on the Express instance.
    constructor() {
        this.app = express();
        this.swagger();
        this.config();
    }
    // grabs data from routers and reads it
    config() {
        const router = express.Router();
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        typescript_rest_1.Server.buildServices(router, UsersRouter_1.default);
        this.app.use(basePath, router);
    }
    // Configure Swagger
    swagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map