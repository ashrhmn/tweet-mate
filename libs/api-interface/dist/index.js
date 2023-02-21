"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = exports.ApiInterface = void 0;
const zod_1 = require("zod");
exports.ApiInterface = { a: "b", d: "e" };
const defaultConfig = {
    paramSchema: zod_1.z.object({}),
    bodySchema: zod_1.z.object({}),
    responseSchema: zod_1.z.object({}),
    querySchema: zod_1.z.object({}),
    method: "GET",
};
exports.endpoints = {
    getUserById: Object.assign(Object.assign({}, defaultConfig), { pattern: "users/:uid", paramSchema: zod_1.z.object({ uid: zod_1.z.coerce.number() }), responseSchema: zod_1.z.object({ uid: zod_1.z.number(), username: zod_1.z.string() }) }),
    getStudentById: Object.assign(Object.assign({}, defaultConfig), { pattern: "students/:sid", paramSchema: zod_1.z.object({ sid: zod_1.z.coerce.number() }), responseSchema: zod_1.z.object({ sid: zod_1.z.number(), studentName: zod_1.z.string() }) }),
    getProductsById: Object.assign(Object.assign({}, defaultConfig), { pattern: "products/:pid", paramSchema: zod_1.z.object({ pid: zod_1.z.coerce.number() }), responseSchema: zod_1.z.object({ pid: zod_1.z.number(), productName: zod_1.z.string() }) }),
    getAllUsers: Object.assign(Object.assign({}, defaultConfig), { pattern: "users", responseSchema: zod_1.z.array(zod_1.z.object({ uid: zod_1.z.number(), username: zod_1.z.string() })) }),
};
