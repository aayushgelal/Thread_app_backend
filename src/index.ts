import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { Prisma_Client } from "./lib/db";
const prisma = new PrismaClient();

const app = express();
const PORT = 5000;
const gqlserver = new ApolloServer({
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
      Name: (_m, { name }: { name: string }) => `Hey ${name}`,
    },
    Mutation: {
      createUser: async (
        _,
        {
          email,
          password,
          first_name,
          last_name,
        }: {
          email: string;
          password: string;
          first_name: string;
          last_name: string;
        }
      ) => {
        await Prisma_Client.user.create({
          data: {
            email,
            firstName: first_name,
            lastName: last_name,
            password,
            salt: "",
          },
        });
        return true;
      },
    },
  },
});

async function checkConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
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
