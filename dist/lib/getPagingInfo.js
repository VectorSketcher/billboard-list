"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagingInfo = void 0;
function getPagingInfo(route, offset, limit, total, additionalParams = '') {
    if (typeof additionalParams === 'object') {
        additionalParams = Object.keys(additionalParams).reduce((aggregate, key, index) => {
            if (!additionalParams[key]) {
                return aggregate;
            }
            return `${aggregate}&${key}=${additionalParams[key]}`;
        }, '');
    }
    return {
        rows: Math.ceil(total / 1),
        pages: limit > 0 ? Math.ceil(total / limit) : 0,
        offset,
        limit,
        links: {
            first: `${route}?offset=0&limit=${limit}${additionalParams}`,
            last: `${route}?offset=${limit > 0 ? (Math.ceil(total / limit) - 1) * limit : 0}&limit=${limit}${additionalParams}`,
            previous: offset > 1 ? `${route}?offset=${Math.max(0, offset - limit)}&limit=${limit}${additionalParams}` : undefined,
            next: offset + limit < total ? `${route}?offset=${offset + limit}&limit=${limit}${additionalParams}` : undefined
        }
    };
}
exports.getPagingInfo = getPagingInfo;
exports.default = getPagingInfo;
//# sourceMappingURL=getPagingInfo.js.map