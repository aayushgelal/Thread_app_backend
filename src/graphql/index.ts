import { ApolloServer } from "@apollo/server";
import User from "./users";
import Post from "./posts";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { Server } from "http";
import { WebSocketServer } from "ws";

export async function createGraphqlServer(httpServer: Server) {
  const typeDefs = `
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
  type Subscription{
    ${Post.subscriptions}
  }
  `;
  const resolvers = {
    Query: { ...User.resolvers.queries, ...Post.resolvers.queries },
    Mutation: { ...User.resolvers.mutations, ...Post.resolvers.mutation },
    Subscription: { ...Post.resolvers.subscription },
  };
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        console.log("connected");
        // Check authentication every time a client connects.
        // You can return false to close the connection or throw an explicit error
      },
      onDisconnect(ctx, code, reason) {
        console.log("Disconnected!");
      },
    },
    wsServer
  );
  const gqlserver = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await gqlserver.start();

  return gqlserver;
}
