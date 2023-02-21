"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = void 0;
const zod_1 = require("zod");
const defaultConfig = {
    paramSchema: zod_1.z.object({}),
    bodySchema: zod_1.z.object({}),
    responseSchema: zod_1.z.object({}),
    querySchema: zod_1.z.object({}),
    method: "GET",
};
exports.endpoints = {
    auth: {
        login: Object.assign(Object.assign({}, defaultConfig), { pattern: "auth/login", method: "POST", bodySchema: zod_1.z.object({ username: zod_1.z.string(), password: zod_1.z.string() }), responseSchema: zod_1.z.string() }),
        signup: Object.assign(Object.assign({}, defaultConfig), { pattern: "auth/signup", method: "POST", bodySchema: zod_1.z.object({
                username: zod_1.z.string(),
                password: zod_1.z.string(),
                confirmPassword: zod_1.z.string(),
            }), responseSchema: zod_1.z.string() }),
        currentUser: Object.assign(Object.assign({}, defaultConfig), { pattern: "auth/current-user", responseSchema: zod_1.z.object({
                username: zod_1.z.string(),
                roles: zod_1.z.array(zod_1.z.string()),
            }) }),
        logout: Object.assign(Object.assign({}, defaultConfig), { pattern: "auth/logout", responseSchema: zod_1.z.void() }),
    },
};
