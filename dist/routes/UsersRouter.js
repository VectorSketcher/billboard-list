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
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_rest_1 = require("typescript-rest");
const typescript_rest_swagger_1 = require("typescript-rest-swagger");
const errors_1 = require("typescript-rest/dist/server/model/errors");
const getPagingInfo_1 = require("../lib/getPagingInfo");
const UserDataManager_1 = require("../managers/UserDataManager");
let UsersRouter = class UsersRouter {
    constructor() {
        this.userDataManager = new UserDataManager_1.default();
    }
    /**
          * Get list of registered users
          * @Param offset
          * @Param limit
          */
    getUsers(offset = 0, limit = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [allUsers] = yield Promise.all([
                    this.userDataManager.getUsers()
                ]);
                // page count of all users
                const count = Array.prototype.push.apply(allUsers);
                allUsers.slice((offset - 1) * limit + 1);
                // returning data along with pagination
                return {
                    data: allUsers,
                    paging: (0, getPagingInfo_1.getPagingInfo)('/getusers', offset, limit, count)
                };
            }
            catch (err) {
                throw (err instanceof typescript_rest_1.Errors.HttpError) ? err : new errors_1.InternalServerError();
            }
        });
    }
};
__decorate([
    typescript_rest_1.GET,
    __param(0, (0, typescript_rest_1.QueryParam)('offset')),
    __param(1, (0, typescript_rest_1.QueryParam)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UsersRouter.prototype, "getUsers", null);
UsersRouter = __decorate([
    (0, typescript_rest_swagger_1.Tags)('Registered Users'),
    (0, typescript_rest_1.Path)('/getusers')
], UsersRouter);
exports.default = UsersRouter;
//# sourceMappingURL=UsersRouter.js.map