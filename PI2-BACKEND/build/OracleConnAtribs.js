"use strict";
/***
 * Esse arquivo é muito interessante.
 * Nele criamos uma constante chamada oraConnAttribs.
 * Sempre que desejarmos usar ela em qualquer código, basta importarmos ;-)
 * Chique né?
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oraConnAttribs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.oraConnAttribs = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: process.env.ORACLE_STR,
};
