"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const typescript_rest_1 = require("typescript-rest");
const TopOneHundredRouter_1 = __importDefault(require("./routes/TopOneHundredRouter"));
const errorFormatMiddleware_1 = __importDefault(require("./lib/errorFormatMiddleware"));
const bodyParser = require('body-parser');
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
        this.app.use(cors);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.text());
        this.handleErrors();
    }
    // grabs data from routers and reads it
    config() {
        const router = express.Router();
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        typescript_rest_1.Server.buildServices(router, TopOneHundredRouter_1.default);
        this.app.use(basePath, router);
    }
    handleErrors() {
        this.app.use(errorFormatMiddleware_1.default);
    }
    // Configure Swagger
    swagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map