export const typeDefs = `#graphql
scalar Date

type Post{
    id:ID!,
    post:String!,
    userId:String!,
    imageUrl:String,
    likes:Int!
    createdTime: Date!
    user:User

   
}`;
