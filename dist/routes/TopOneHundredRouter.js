"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const typescript_rest_1 = require("typescript-rest");
const typescript_rest_swagger_1 = require("typescript-rest-swagger");
const errors_1 = require("typescript-rest/dist/server/model/errors");
const getPagingInfo_1 = require("../lib/getPagingInfo");
const BillboardSongsDataManager_1 = __importDefault(require("../managers/BillboardSongsDataManager"));
const topOneHundredModel_1 = require("../types/models/topOneHundredModel");
let TopOneHundredRouter = class TopOneHundredRouter {
    constructor() {
        this.billboardSongsDataManager = new BillboardSongsDataManager_1.default();
    }
    /**
          * Get list of top 100 billboard songs
          * @Param offset
          * @Param limit
          */
    getTopOneHundred(topOneHundredId, artist, artistType, releaseYear, album, isFavorite, offset = 0, limit = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { topOneHundredId, artist, artistType, releaseYear, album, isFavorite };
                const allSongs = yield this.billboardSongsDataManager.getSongs(filter, { offset, limit });
                // page count of all songs
                const count = Array.prototype.push.apply(limit);
                return {
                    data: allSongs,
                    paging: (0, getPagingInfo_1.getPagingInfo)('/toponehundred', offset, limit, count)
                };
            }
            catch (err) {
                throw (err instanceof typescript_rest_1.Errors.HttpError) ? err : new errors_1.InternalServerError();
            }
        });
    }
    /**
       * Create a new song to be added to list
       * @param id The ID of the Song
       * @param body The song to create
       */
    postTopOneHundred(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const song = new topOneHundredModel_1.TopOneHundred(body);
            const item = yield this.billboardSongsDataManager.addSongToList(song);
            return { data: item };
        });
    }
    /**
       * Favorite or De-Favorite a Song
       * @param topOneHundredId The ID of the Song to Favorite
       */
    putFavorite(topOneHundredId) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.billboardSongsDataManager.favorite(topOneHundredId);
            return { data: item };
        });
    }
};
__decorate([
    typescript_rest_1.GET,
    __param(0, (0, typescript_rest_1.QueryParam)('topOneHundredId')),
    __param(1, (0, typescript_rest_1.QueryParam)('artist')),
    __param(2, (0, typescript_rest_1.QueryParam)('artistType')),
    __param(3, (0, typescript_rest_1.QueryParam)('releaseYear')),
    __param(4, (0, typescript_rest_1.QueryParam)('album')),
    __param(5, (0, typescript_rest_1.QueryParam)('isFavorite')),
    __param(6, (0, typescript_rest_1.QueryParam)('offset')),
    __param(7, (0, typescript_rest_1.QueryParam)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Date, String, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], TopOneHundredRouter.prototype, "getTopOneHundred", null);
__decorate([
    typescript_rest_1.POST,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [topOneHundredModel_1.TopOneHundred]),
    __metadata("design:returntype", Promise)
], TopOneHundredRouter.prototype, "postTopOneHundred", null);
__decorate([
    (0, typescript_rest_1.Path)('favorite/:id'),
    typescript_rest_1.PUT,
    __param(0, (0, typescript_rest_1.QueryParam)('topOneHundredId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopOneHundredRouter.prototype, "putFavorite", null);
TopOneHundredRouter = __decorate([
    (0, typescript_rest_swagger_1.Tags)('Gets Top One Hundred Songs'),
    (0, typescript_rest_1.Path)('/toponehundred')
], TopOneHundredRouter);
exports.default = TopOneHundredRouter;
//# sourceMappingURL=TopOneHundredRouter.js.map