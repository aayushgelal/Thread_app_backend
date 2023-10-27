import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { createGraphqlServer } from "./graphql";

const app = express();
const PORT = 5000;

async function init() {
  app.use(express.json());
  app.use("/graphql", expressMiddleware(await createGraphqlServer()));
}

init();
app.get("/", (req, res) => {
  res.sendStatus(200).json({ message: "running successfully" });
});

app.listen(PORT, () => console.log("running successfully"));
