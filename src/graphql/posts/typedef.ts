export const typeDefs = `#graphql
scalar DateTime

type Post{
    id:ID!,
    post:String!,
    userId:String!,
    imageUrl:String,
    likes:Int!
    createdTime: DateTime!

   
}`;
