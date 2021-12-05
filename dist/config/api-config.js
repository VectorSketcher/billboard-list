"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = __importStar(require("log4js"));
const api_json_1 = __importDefault(require("./api.json"));
function getConfig() {
    const parseJSON = (str) => {
        try {
            return {
                payload: JSON.parse(str),
                message: undefined
            };
        }
        catch (e) {
            return {
                payload: undefined,
                message: str || undefined
            };
        }
    };
    log4js.addLayout('json', config => logEvent => {
        const level = logEvent.level;
        const data = parseJSON(logEvent.data[0]);
        const message = data.message;
        const payload = data.payload;
        const context = logEvent.data.length > 1 ? parseJSON(logEvent.data[1]) : undefined;
        const newEvent = {
            dateTime: logEvent.startTime,
            logCategory: logEvent.categoryName,
            logLevel: level.levelStr,
            message,
            payload,
            context
        };
        return `${JSON.stringify(newEvent)} \n`;
    });
    let config;
    switch (process.env.NODE_ENV) {
        default: config = api_json_1.default;
    }
    log4js.configure(config.log4js);
    return config;
}
module.exports = getConfig();
//# sourceMappingURL=api-config.js.map