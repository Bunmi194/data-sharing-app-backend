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
exports.validateToken = exports.validateSession = exports.updateCompanyData = exports.writeCompanyDataToDatabase = exports.deleteCompanyData = exports.getASingleCompanyData = exports.getCompanyDataGroupedById = exports.getUserData = void 0;
const http_status_codes_1 = require("http-status-codes");
const firebase_1 = require("../auth/firebase");
const company_1 = __importDefault(require("../model/company"));
const env_1 = require("../env");
const getUserData = (userId) => {
    return company_1.default.findAll({
        where: {
            userId: userId,
        },
    })
        .then((data) => {
        return data;
    })
        .catch((error) => {
        console.log("Error: ", error);
        return null;
    });
};
exports.getUserData = getUserData;
const getCompanyDataGroupedById = () => {
    return company_1.default.findAll({
        raw: true,
    })
        .then((data) => {
        return data.reduce((result, record) => {
            const existingEntry = result.find((entry) => entry.userId === record.userId);
            if (existingEntry) {
                existingEntry.companies.push({
                    id: record.id,
                    companyName: record.companyName,
                    numberOfUsers: record.numberOfUsers,
                    numberOfProducts: record.numberOfProducts,
                    percentage: record.percentage,
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt,
                });
            }
            else {
                result.push({
                    userId: record.userId,
                    companies: [
                        {
                            id: record.id,
                            companyName: record.companyName,
                            numberOfUsers: record.numberOfUsers,
                            numberOfProducts: record.numberOfProducts,
                            percentage: record.percentage,
                            createdAt: record.createdAt,
                            updatedAt: record.updatedAt,
                        },
                    ],
                });
            }
            return result;
        }, []);
    })
        .catch((error) => {
        console.log("Error: ", error);
        return null;
    });
};
exports.getCompanyDataGroupedById = getCompanyDataGroupedById;
const getASingleCompanyData = (userId) => {
    return company_1.default.findByPk(userId)
        .then((data) => {
        return data;
    })
        .catch((error) => {
        console.log("Error: ", error);
        return null;
    });
};
exports.getASingleCompanyData = getASingleCompanyData;
const deleteCompanyData = (dataId) => {
    return company_1.default.destroy({
        where: {
            id: dataId,
        },
    })
        .then(() => {
        return true;
    })
        .catch((error) => {
        console.log("Error: ", error);
        return null;
    });
};
exports.deleteCompanyData = deleteCompanyData;
const writeCompanyDataToDatabase = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return company_1.default.create(data)
        .then((data) => {
        return data;
    })
        .catch((error) => {
        console.error(error);
        return null;
    });
});
exports.writeCompanyDataToDatabase = writeCompanyDataToDatabase;
const updateCompanyData = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    let companyData = yield (0, exports.getASingleCompanyData)(id);
    if (!companyData) {
        return false;
    }
    companyData = Object.assign(Object.assign({}, companyData), data);
    return companyData
        .save()
        .then((data) => {
        return data;
    })
        .catch((error) => {
        console.error(error);
        return false;
    });
});
exports.updateCompanyData = updateCompanyData;
//middleware
const validateSession = (req, res, next) => {
    const { origin } = req.headers;
    if (!origin || origin !== env_1.CLIENTURL) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Bad request",
        });
    }
    next();
};
exports.validateSession = validateSession;
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: false,
            message: "Unauthorized",
        });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: false,
            message: "Unauthorized",
        });
    }
    const isTokenValid = yield (0, firebase_1.verifyToken)(token);
    if (isTokenValid) {
        req.body.decodedToken = isTokenValid.uid;
        next();
    }
    else {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: false,
            message: "Unauthorized",
        });
    }
});
exports.validateToken = validateToken;
