"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserInputOnLogin = exports.validateUserInputOnSignup = void 0;
const zod_1 = require("zod");
exports.validateUserInputOnSignup = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "First name is required",
    }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email("Invalid email"),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(5, "Password length must be greater than 5"),
});
exports.validateUserInputOnLogin = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email("Invalid email"),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(5, "Password length must be greater than 5"),
});
