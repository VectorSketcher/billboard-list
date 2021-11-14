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
Object.defineProperty(exports, "__esModule", { value: true });
// this would be used for database calls
const axios_1 = require("axios");
const count_1 = require("../types/count");
class UserDataManager extends count_1.BaseCountClass {
    // get all users
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let mergedUsers;
            try {
                // step 1, go out and grab data
                const [registered, unregistered, memberships] = yield Promise.all([
                    this.getRegisteredUsers(),
                    this.getUnRegisteredUsers(),
                    this.getProjectMemberships()
                ]);
                // step 2, merge all users together into one array
                if (registered && unregistered && memberships) {
                    mergedUsers = [...registered, ...unregistered];
                    // step 3, for each element of users push empty projectid array
                    mergedUsers.forEach(element => {
                        element.projectIds = [];
                    });
                    // step 4, now compare all users array to our membership array finding project ids
                    for (let i = 0; i < mergedUsers.length; i++) {
                        for (let j = 0; j < memberships.length; j++) {
                            if (mergedUsers[i].id === memberships[j].userId) {
                                mergedUsers[i].projectIds.push(memberships[j].projectId);
                            }
                        }
                    }
                    return mergedUsers;
                }
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    // get registered users
    getRegisteredUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get('https://5c3ce12c29429300143fe570.mockapi.io/api/registeredusers');
            return result.data;
        });
    }
    // gets unregistered users
    getUnRegisteredUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get('https://5c3ce12c29429300143fe570.mockapi.io/api/unregisteredusers');
            return result.data;
        });
    }
    // gets project memberships
    getProjectMemberships() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield axios_1.default.get('https://5c3ce12c29429300143fe570.mockapi.io/api/projectmemberships');
            return result.data;
        });
    }
}
exports.default = UserDataManager;
//# sourceMappingURL=UserDataManager.js.map