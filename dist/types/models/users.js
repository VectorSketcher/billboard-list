"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["En"] = "en";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));
class Users {
    constructor(data) {
        this.id = data.id;
        this.city = data.city;
        this.company = data.company;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.organizationType = data.organizationType;
        this.phone = data.phone;
        this.state = data.state;
        this.zipCode = data.zipCode;
        this.disclaimerAccepted = data.disclaimerAccepted;
        this.languageCode = data.languageCode;
        this.registrationId = data.registrationId;
        this.projectId = data.projectId;
        this.userId = data.userId;
    }
}
exports.Users = Users;
//# sourceMappingURL=users.js.map