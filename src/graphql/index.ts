import { ApolloServer } from "@apollo/server";
import User from "./users";
import Post from "./posts";

export async function createGraphqlServer() {
  const gqlserver = new ApolloServer({
    typeDefs: `
    ${User.typeDefs}
    ${Post.typeDefs}
    type Query{
        ${User.queries}
        ${Post.queries}
    }
    type Mutation{
        ${User.mutation}
        ${Post.mutation}

    }
    `,
    resolvers: {
      Query: { ...User.resolvers.queries, ...Post.resolvers.queries },
      Mutation: { ...User.resolvers.mutations, ...Post.resolvers.mutation },
    },
  });
  await gqlserver.start();

  return gqlserver;
}
