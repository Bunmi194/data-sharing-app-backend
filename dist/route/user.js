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
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const firebase_1 = __importDefault(require("../config/firebase"));
const user_1 = require("../controller/user");
const company_1 = require("../controller/company");
const crypto_1 = require("../utils/crypto");
const cloudinary_1 = require("../config/cloudinary");
const route = express_1.default.Router();
route.post("/register", user_1.validateUserInputOnSignUpMiddleware, user_1.checkIfEmailExists, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.emailExists) {
        return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
            status: false,
            message: "Email already exists",
        });
    }
    try {
        const newUser = yield firebase_1.default.auth().createUser({
            displayName: req.body.name,
            email: req.body.email,
            password: req.body.password,
            emailVerified: true,
        });
        const savedUserInDatabase = yield (0, user_1.writeUserToDatabase)({
            id: newUser.uid,
            name: req.body.name,
            email: req.body.email,
        });
        if (savedUserInDatabase) {
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: true,
                message: "Sign up successful",
            });
        }
        return res.status(http_status_codes_1.StatusCodes.FAILED_DEPENDENCY).json({
            status: false,
            message: "Please try again later",
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
})); //signup
//login
route.post("/login", user_1.checkIfTokenExists, user_1.validateUserTokenOnLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, id, token } = req.body;
    try {
        const user = (yield (0, user_1.doesUserExists)(email));
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: false,
                message: `User ${email} does not exist`,
            });
        }
        if (user.id !== id) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                status: false,
                message: `Forbidden request`,
            });
        }
        //get user data
        const userData = (yield (0, company_1.getUserData)(id));
        res.setHeader("x-api-key", (0, crypto_1.encryptData)(email));
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: true,
            userData,
            token,
            user,
            message: "Login successful",
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
})); //login
//admin
route.post("/edit", company_1.validateSession, company_1.validateToken, user_1.adminAuth, cloudinary_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!req.file) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "No image file",
        });
    }
    try {
        cloudinary_1.cloudinaryUpload.uploader
            .upload_stream((error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.log("Error uploading image: ", error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: false,
                    message: "Internal Server Error",
                });
            }
            const updateUserPhoto = yield (0, user_1.updateUserProfile)(id, result.secure_url);
            if (!updateUserPhoto) {
                return res.status(http_status_codes_1.StatusCodes.FAILED_DEPENDENCY).json({
                    status: false,
                    message: "Please try again later",
                });
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: true,
                records: result,
                message: "Upload successful",
            });
        }))
            .end(req.file.buffer);
    }
    catch (error) {
        console.log("Error: ", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}));
//return all users
route.get("/", company_1.validateSession, company_1.validateToken, user_1.adminAuth, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield (0, user_1.getAllUsers)();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: true,
            records: allUsers,
            message: "Users fetched successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
})); //return all users to admin
const userRoutes = route;
exports.default = userRoutes;
