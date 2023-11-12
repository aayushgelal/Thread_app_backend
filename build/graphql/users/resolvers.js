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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const user_1 = require("../../services/user");
exports.resolvers = {
    queries: {
        UserLogin: (_, payload, { req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield user_1.UserService.generateJWTToken(payload);
            res.cookie("access-token", token, {
                expires: new Date(Date.now() + 30 * 24 * 3600000),
            });
            const user = yield user_1.UserService.decodeJWTToken(token);
            return user;
        }),
        getCurrentUserLoggedIn: (_, params, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (context.user) {
                const user = yield user_1.UserService.findUser(context.user.id);
                return Object.assign({}, user);
            }
            throw new Error("Who are you??");
        }),
    },
    mutations: {
        createUser: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield user_1.UserService.createUser(payload);
            return res.id;
        }),
    },
};
