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
exports.createGraphqlServer = void 0;
const server_1 = require("@apollo/server");
const users_1 = __importDefault(require("./users"));
function createGraphqlServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const gqlserver = new server_1.ApolloServer({
            typeDefs: `
    ${users_1.default.typeDefs}
    type Query{
        ${users_1.default.queries}
    }
    type Mutation{
        ${users_1.default.mutation}

    }
    `,
            resolvers: {
                Query: users_1.default.resolvers.queries,
                Mutation: users_1.default.resolvers.mutations,
            },
        });
        yield gqlserver.start();
        return gqlserver;
    });
}
exports.createGraphqlServer = createGraphqlServer;
