"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
scalar DateTime

type Post{
    id:ID!,
    post:String!,
    userId:String!,
    imageUrl:String,
    likes:Int!
    createdTime: DateTime!

   
}`;
