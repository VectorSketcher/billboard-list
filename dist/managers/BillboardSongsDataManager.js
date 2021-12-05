"use strict";
/* eslint-disable prefer-const */
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
const typescript_rest_swagger_1 = require("typescript-rest-swagger");
const http_status_1 = require("http-status");
class BillboardSongsDataManager {
    constructor() {
        this.tableName = 'top_one_hundred';
    }
    // used to add songs to db
    addSongToList(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const sql = 'INSERT INTO top_one_hundred (top_one_hundred_id, artist, artist_type, release_year, album, is_favorite) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
                const values = [data.topOneHundredId, data.artist, data.artistType, data.releaseYear, data.album, data.isFavorite];
                result = yield connection_1.default.query(sql, values);
                (0, typescript_rest_swagger_1.Response)(http_status_1.OK);
                if (result) {
                    return (result.rows[0]);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // used to favorite or unfavorite a song
    favorite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                const sql = `UPDATE ${this.tableName} SET is_favorite = NOT is_favorite WHERE top_one_hundred_id = ${id} RETURNING *`;
                result = yield connection_1.default.query(sql);
                (0, typescript_rest_swagger_1.Response)(http_status_1.OK);
                if (result) {
                    return (result.rows[0]);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // get songs
    getSongs(searchParams, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            const chosenColumn = [];
            const filters = [];
            const searchParameters = [searchParams === null || searchParams === void 0 ? void 0 : searchParams.topOneHundredId, searchParams === null || searchParams === void 0 ? void 0 : searchParams.artist, searchParams === null || searchParams === void 0 ? void 0 : searchParams.artistType, searchParams === null || searchParams === void 0 ? void 0 : searchParams.releaseYear, searchParams === null || searchParams === void 0 ? void 0 : searchParams.album, searchParams === null || searchParams === void 0 ? void 0 : searchParams.isFavorite];
            const columns = ['top_one_hundred_id', 'artist', 'artist_type', 'release_year', 'album', 'is_favorite'];
            if (searchParameters.some(item => item !== undefined)) {
                // a way to create dynamic columns for our sql query, probably a better way for this but this loops through the searchParameters finding the index/position then compares that index to the columns, this only works because the columns position doesn't change
                for (let i = 0; i < searchParameters.length; i++) {
                    if (searchParameters[i] !== undefined) {
                        chosenColumn.push(columns[i]);
                        filters.push(searchParameters[i]);
                        continue;
                    }
                }
                // used only if a filter/parameter was used
                // eslint-disable-next-line no-unused-expressions
                query = `SELECT * FROM ${this.tableName} WHERE ${chosenColumn} = '${filters}'`;
            }
            else {
                // used only if no filter/parameter was used, grabs all songs
                query = `SELECT * FROM top_one_hundred LIMIT ${paging.limit} OFFSET ${paging.offset}`;
            }
            try {
                let result;
                result = yield connection_1.default.query(query);
                (0, typescript_rest_swagger_1.Response)(http_status_1.OK);
                if (result.rows) {
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