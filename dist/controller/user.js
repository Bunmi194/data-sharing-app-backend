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
exports.checkIfUserExists = exports.adminAuth = exports.validateUserTokenOnLogin = exports.checkIfEmailExists = exports.checkIfTokenExists = exports.validateUserInputOnSignUpMiddleware = exports.getAllUsers = exports.updateUserProfile = exports.doesUserExists = exports.compareUserForAuthentication = exports.userExistsWithId = exports.writeUserToDatabase = void 0;
const zod_1 = require("../auth/zod");
const http_status_codes_1 = require("http-status-codes");
const user_1 = __importDefault(require("../model/user"));
const firebase_1 = require("../auth/firebase");
const writeUserToDatabase = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return user_1.default.create(user)
        .then((user) => {
        return user;
    })
        .catch((error) => {
        console.error(error);
        return null;
    });
});
exports.writeUserToDatabase = writeUserToDatabase;
const userExists = (email) => {
    return user_1.default.findOne({ where: { email } })
        .then((user) => {
        return user;
    })
        .catch((error) => {
        console.error("Error: ", error);
        return null;
    });
};
const userExistsWithId = (id) => {
    return user_1.default.findOne({ where: { id } })
        .then((user) => {
        return user;
    })
        .catch((error) => {
        console.error("Error: ", error);
        return null;
    });
};
exports.userExistsWithId = userExistsWithId;
const compareUserForAuthentication = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.userExistsWithId)(id);
    if (user && user.email === email) {
        return true;
    }
    return false;
});
exports.compareUserForAuthentication = compareUserForAuthentication;
const doesUserExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if user exists
        const user = (yield userExists(email));
        if (!user) {
            return null;
        }
        return user;
    }
    catch (error) {
        console.log(`Error: ${error}`);
        return null;
    }
});
exports.doesUserExists = doesUserExists;
const updateUserProfile = (id, url) => __awaiter(void 0, void 0, void 0, function* () {
    let userData = yield (0, exports.userExistsWithId)(id);
    if (!userData) {
        return false;
    }
    userData.profile = url;
    return userData
        .save()
        .then((data) => {
        return data;
    })
        .catch((error) => {
        console.error(error);
        return false;
    });
});
exports.updateUserProfile = updateUserProfile;
const getAllUsers = () => {
    return user_1.default.findAll()
        .then((data) => {
        return data;
    })
        .catch((error) => {
        console.log("Error: ", error);
        return null;
    });
};
exports.getAllUsers = getAllUsers;
//middleware
const validateUserInputOnSignUpMiddleware = (req, res, next) => {
    try {
        //validate user input
        const error = zod_1.validateUserInputOnSignup.safeParse(req.body);
        if (error.success === false) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.error.issues[0].message,
            });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Please enter valid inputs",
        });
    }
};
exports.validateUserInputOnSignUpMiddleware = validateUserInputOnSignUpMiddleware;
const checkIfTokenExists = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: false,
            message: "No authorization headers",
        });
    }
    try {
        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "No token",
            });
        }
        req.body.token = token;
        next();
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};
exports.checkIfTokenExists = checkIfTokenExists;
const checkIfEmailExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const userRecord = yield (0, firebase_1.emailExists)(email);
        userRecord ? (req.body.emailExists = true) : (req.body.emailExists = false);
        next();
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
});
exports.checkIfEmailExists = checkIfEmailExists;
const validateUserTokenOnLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: false,
            message: "Please provide a token",
        });
    }
    try {
        const userRecord = yield (0, firebase_1.verifyToken)(token);
        if (userRecord) {
            req.body.id = userRecord.uid;
            next();
            return;
        }
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
            status: false,
            message: "Bad token",
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
});
exports.validateUserTokenOnLogin = validateUserTokenOnLogin;
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { decodedToken } = req.body;
    try {
        const user = yield (0, exports.userExistsWithId)(decodedToken);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Unauthorized",
            });
        }
        if (user.admin !== true) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Unauthorized",
            });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
});
exports.adminAuth = adminAuth;
const checkIfUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { decodedToken } = req.body;
    try {
        const user = yield (0, exports.userExistsWithId)(decodedToken);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "User is unathourized.",
            });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error.",
        });
    }
});
exports.checkIfUserExists = checkIfUserExists;
