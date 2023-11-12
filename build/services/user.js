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
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../lib/db");
const crypto_1 = require("crypto");
const JWTSECRETKEY = "superman@11";
class UserService {
    static getUserbyMail(email) {
        return db_1.Prisma_Client.user.findUnique({ where: { email: email } });
    }
    static generateHash(salt, password) {
        return (0, crypto_1.createHmac)("sha256", salt).update(password).digest("hex");
    }
    static createUser(payload) {
        const { firstName, lastName, email, password, username } = payload;
        const salt = (0, crypto_1.randomBytes)(32).toString("hex");
        const hashed_password = UserService.generateHash(salt, password);
        return db_1.Prisma_Client.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashed_password,
                username,
                salt,
            },
        });
    }
    static generateJWTToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield UserService.getUserbyMail(email);
            if (!user) {
                throw new Error("error user not found");
            }
            const salt = user.salt;
            const hashed_password = UserService.generateHash(salt, password);
            if (hashed_password != user.password) {
                throw new Error("the password is wrong");
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImageURL: user.profileImageUrl,
                username: user.username,
            }, JWTSECRETKEY);
            return token;
        });
    }
    static decodeJWTToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.verify(payload, JWTSECRETKEY);
        });
    }
    static findUser(payload) {
        return db_1.Prisma_Client.user.findUnique({
            where: {
                id: payload,
            },
        });
    }
}
exports.UserService = UserService;
