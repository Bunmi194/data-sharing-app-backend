"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./env");
app_1.default.listen(env_1.PORT, () => {
    console.log(`Server listening on PORT ${env_1.PORT}`);
});
