import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

const app = express();
const PORT = 5000;
const gqlserver = new ApolloServer({
  typeDefs: `type Query{
    Hello:String,
    Name(name:String):String
    
    
  }`,
  resolvers: {
    Query: {
      Hello: () => "Hi br",
      Name: (_m, { name }: { name: string }) => `Hey ${name}`,
    },
  },
});

async function init() {
  await gqlserver.start();
  app.use(express.json());
  app.use("/graphql", expressMiddleware(gqlserver));
}

init();
app.get("/", (req, res) => {
  res.sendStatus(200).json({ message: "running successfully" });
});

app.listen(PORT, () => console.log("running successfully"));
