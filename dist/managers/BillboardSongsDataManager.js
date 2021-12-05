"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../config/connection"));
const express_1 = require("express");
const typescript_rest_swagger_1 = require("typescript-rest-swagger");
const http_status_1 = require("http-status");
class BillboardSongsDataManager {
    constructor() {
        this.tableName = 'top_one_hundred';
    }
    addSongToList(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = 'INSERT INTO top_one_hundred (top_one_hundred_id, artist, artist_type, release_year, album, favorite) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
                const values = [data.topOneHundredId, data.artist, data.artistType, data.releaseYear, data.album, data.favorite];
                const result = yield connection_1.default.query(sql, values);
                return result[0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // get songs
    getSongs2(searchParams, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            const chosenColumn = [];
            const filters = [];
            const searchParameters = [searchParams === null || searchParams === void 0 ? void 0 : searchParams.topOneHundredId, searchParams === null || searchParams === void 0 ? void 0 : searchParams.artist, searchParams === null || searchParams === void 0 ? void 0 : searchParams.artistType, searchParams === null || searchParams === void 0 ? void 0 : searchParams.releaseYear, searchParams === null || searchParams === void 0 ? void 0 : searchParams.album, searchParams === null || searchParams === void 0 ? void 0 : searchParams.favorite];
            const columns = ['top_one_hundred_id', 'artist', 'artist_type', 'release_year', 'album', 'favorite'];
            if (searchParameters.some(item => item !== undefined)) {
                // a way to create dynamic columns for our sql query, probably a better way for this
                for (let i = 0; i < searchParameters.length; i++) {
                    if (searchParameters[i] !== undefined) {
                        chosenColumn.push(columns[i]);
                        filters.push(searchParameters[i]);
                        continue;
                    }
                }
                query = `SELECT * FROM ${this.tableName} WHERE ${chosenColumn} = '${filters}'`;
            }
            else {
                query = 'SELECT * FROM top_one_hundred';
            }
            try {
                let result;
                // eslint-disable-next-line prefer-const
                result = yield connection_1.default.query(query);
                // Response.status(200).send('ok');
                (0, typescript_rest_swagger_1.Response)(http_status_1.OK);
                if (result.rows) {
                    return (result.rows);
                }
                return;
            }
            catch (err) {
                console.log(err.stack);
            }
        });
    }
    // get songs
    getSongs(searchParam, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            const chosenColumn = [];
            const filters = [];
            const searchParameters = [searchParam === null || searchParam === void 0 ? void 0 : searchParam.topOneHundredId, searchParam === null || searchParam === void 0 ? void 0 : searchParam.artist, searchParam === null || searchParam === void 0 ? void 0 : searchParam.artistType, searchParam === null || searchParam === void 0 ? void 0 : searchParam.releaseYear, searchParam === null || searchParam === void 0 ? void 0 : searchParam.album, searchParam === null || searchParam === void 0 ? void 0 : searchParam.favorite];
            const columns = ['top_one_hundred_id', 'artist', 'artist_type', 'release_year', 'album', 'favorite'];
            if (searchParameters.some(item => item !== undefined)) {
                // a way to create dynamic columns for our sql query, probably a better way for this
                for (let i = 0; i < searchParameters.length; i++) {
                    if (searchParameters[i] !== undefined) {
                        chosenColumn.push(columns[i]);
                        filters.push(searchParameters[i]);
                        continue;
                    }
                }
                query = {
                    name: 'fetch-song',
                    text: `SELECT * FROM ${this.tableName} WHERE ${chosenColumn} = '${filters}'`
                };
            }
            else {
                query = 'SELECT * FROM top_one_hundred';
            }
            try {
                let result;
                result = yield connection_1.default.query(query);
                if (result) {
                    express_1.response.status(200).send('ok');
                    return (result.rows);
                }
            }
            catch (err) {
                console.log(err.stack);
            }
        });
    }
}
exports.default = BillboardSongsDataManager;
//# sourceMappingURL=BillboardSongsDataManager.js.map