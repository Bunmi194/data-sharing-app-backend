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
const company_1 = require("../controller/company");
const user_1 = require("../controller/user");
const route = express_1.default.Router();
//add data
route.post("/", company_1.validateSession, company_1.validateToken, user_1.checkIfUserExists, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, companyName, numberOfUsers, numberOfProducts, percentage } = req.body;
    try {
        const data = {
            userId,
            companyName,
            numberOfUsers: Number(numberOfUsers),
            numberOfProducts: Number(numberOfProducts),
            percentage: Number(percentage),
        };
        const writtenData = yield (0, company_1.writeCompanyDataToDatabase)(data);
        if (!writtenData) {
            return res.status(http_status_codes_1.StatusCodes.FAILED_DEPENDENCY).json({
                status: false,
                message: "Please try again",
            });
        }
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: true,
            writtenData,
            message: "Data was successfully created",
        });
    }
    catch (error) {
        console.log(`Error: ${error}`);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}));
route.put("/:id", (req, res) => {
    //get and validate session
    //get and validate token
    //check if user exists
    //edit data in DB
}); //edit
route.delete("/:id", (req, res) => {
    //get and validate session
    //get and validate token
    //check if user exists
    //delete data into DB
}); //delete data
//return all data by id for user
route.get("/:id", company_1.validateSession, company_1.validateToken, user_1.checkIfUserExists, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { decodedToken } = req.body;
    const { id } = req.params;
    try {
        const records = yield (0, company_1.getUserData)(decodedToken);
        if (!records) {
            return res.status(http_status_codes_1.StatusCodes.FAILED_DEPENDENCY).json({
                status: false,
                message: "Please try again",
            });
        }
        if (decodedToken !== id) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Unauthorized",
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: true,
            records,
            message: "Records fetched successfully",
        });
    }
    catch (error) {
        console.log("Error: ", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}));
//admin
//return all data by id for admin
route.get("/admin/:id", company_1.validateSession, company_1.validateToken, user_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { decodedToken } = req.body;
    const { id } = req.params;
    try {
        const records = yield (0, company_1.getUserData)(id);
        if (!records) {
            return res.status(http_status_codes_1.StatusCodes.FAILED_DEPENDENCY).json({
                status: false,
                message: "Please try again",
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: true,
            records,
            message: "Records fetched successfully",
        });
    }
    catch (error) {
        console.log("Error: ", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}));
//group data by id and return as stats for admin
route.get("/statistics/admin", company_1.validateSession, company_1.validateToken, user_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allCompanyData = yield (0, company_1.getCompanyDataGroupedById)();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: true,
            records: allCompanyData,
            message: "Statistics fetched successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}));
const companyRoutes = route;
exports.default = companyRoutes;
