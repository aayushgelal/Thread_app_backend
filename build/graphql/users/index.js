"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mutation_1 = require("./mutation");
const queries_1 = require("./queries");
const resolvers_1 = require("./resolvers");
const typedef_1 = require("./typedef");
const User = { mutation: mutation_1.mutation, queries: queries_1.queries, resolvers: resolvers_1.resolvers, typeDefs: typedef_1.typeDefs };
exports.default = User;
