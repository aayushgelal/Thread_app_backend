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
const posts_1 = __importDefault(require("./posts"));
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const schema_1 = require("@graphql-tools/schema");
const ws_1 = require("graphql-ws/lib/use/ws");
const ws_2 = require("ws");
function createGraphqlServer(httpServer) {
    return __awaiter(this, void 0, void 0, function* () {
        const typeDefs = `
  ${users_1.default.typeDefs}
  ${posts_1.default.typeDefs}
  type Query{
      ${users_1.default.queries}
      ${posts_1.default.queries}
  }
  type Mutation{
      ${users_1.default.mutation}
      ${posts_1.default.mutation}


  }
  type Subscription{
    ${posts_1.default.subscriptions}
  }
  `;
        const resolvers = {
            Query: Object.assign(Object.assign({}, users_1.default.resolvers.queries), posts_1.default.resolvers.queries),
            Mutation: Object.assign(Object.assign({}, users_1.default.resolvers.mutations), posts_1.default.resolvers.mutation),
            Subscription: Object.assign({}, posts_1.default.resolvers.subscription),
        };
        const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
        const wsServer = new ws_2.WebSocketServer({
            // This is the `httpServer` we created in a previous step.
            server: httpServer,
            // Pass a different path here if app.use
            // serves expressMiddleware at a different path
            path: "/graphql",
        });
        // Hand in the schema we just created and have the
        // WebSocketServer start listening.
        const serverCleanup = (0, ws_1.useServer)({
            schema,
            onConnect: (ctx) => __awaiter(this, void 0, void 0, function* () {
                console.log("connected");
                // Check authentication every time a client connects.
                // You can return false to close the connection or throw an explicit error
            }),
            onDisconnect(ctx, code, reason) {
                console.log("Disconnected!");
            },
        }, wsServer);
        const gqlserver = new server_1.ApolloServer({
            schema,
            plugins: [
                // Proper shutdown for the HTTP server.
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                // Proper shutdown for the WebSocket server.
                {
                    serverWillStart() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                drainServer() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        yield serverCleanup.dispose();
                                    });
                                },
                            };
                        });
                    },
                },
            ],
        });
        yield gqlserver.start();
        return gqlserver;
    });
}
exports.createGraphqlServer = createGraphqlServer;
