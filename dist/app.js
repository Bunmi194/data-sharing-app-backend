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
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const user_1 = __importDefault(require("./route/user"));
const company_1 = __importDefault(require("./route/company"));
const env_1 = require("./env");
const express_session_1 = __importDefault(require("express-session"));
const database_1 = require("./config/database");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: `${env_1.CLIENTURL}`, //change this after deployment
}));
app.use((0, express_session_1.default)({
    secret: `${env_1.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60 * 1000,
    },
}));
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.sequelize.authenticate();
        console.log(`Database connection established`);
    }
    catch (error) {
        console.log("Error: ", error);
    }
});
connectDatabase();
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use("/v1/user", user_1.default);
app.use("/v1/data", company_1.default);
exports.default = app;
