import { ApolloServer } from "@apollo/server";
import User from "./users";

export async function createGraphqlServer() {
  const gqlserver = new ApolloServer({
    typeDefs: `
    ${User.typeDefs}
    type Query{
        ${User.queries}
    }
    type Mutation{
        ${User.mutation}

    }
    `,
    resolvers: {
      Query: User.resolvers.queries,
      Mutation: User.resolvers.mutations,
    },
  });
  await gqlserver.start();

  return gqlserver;
}
