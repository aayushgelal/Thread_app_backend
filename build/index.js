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
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const client_1 = require("@prisma/client");
const db_1 = require("./lib/db");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = 5000;
const gqlserver = new server_1.ApolloServer({
    typeDefs: `type Query{
    Hello:String,
    Name(name:String):String
  }
    type Mutation{
      createUser(email:String!,password:String!,first_name:String!,last_name:String!):Boolean
  
    
  }`,
    resolvers: {
        Query: {
            Hello: () => "Hi br",
            Name: (_m, { name }) => `Hey ${name}`,
        },
        Mutation: {
            createUser: (_, { email, password, first_name, last_name, }) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.Prisma_Client.user.create({
                    data: {
                        email,
                        firstName: first_name,
                        lastName: last_name,
                        password,
                        salt: "",
                    },
                });
                return true;
            }),
        },
    },
});
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log("Connected to the database");
        }
        catch (error) {
            console.error("Error connecting to the database:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
checkConnection();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield gqlserver.start();
        app.use(express_1.default.json());
        app.use("/graphql", (0, express4_1.expressMiddleware)(gqlserver));
    });
}
init();
app.get("/", (req, res) => {
    res.sendStatus(200).json({ message: "running successfully" });
});
app.listen(PORT, () => console.log("running successfully"));
