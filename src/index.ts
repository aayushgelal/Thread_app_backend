import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { createGraphqlServer } from "./graphql";
import { UserService } from "./services/user";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = 5000;
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(async (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  console.log("here_inside_express");
  console.log(accessToken);
  try {
    const user: any = await UserService.decodeJWTToken(accessToken as string);
    (req as any).userId = user.id;
  } catch {}

  next();
});
async function init() {
  app.use(express.json());
  app.use(
    "/graphql",

    expressMiddleware(await createGraphqlServer(), {
      context: async ({ req, res }: any) => {
        return { req, res };
        // try {,
        //   return { user };
        // } catch {}
      },
    })
  );
}

init();
app.get("/", (req, res) => {
  res.sendStatus(200).json({ message: "running successfully" });
});

app.listen(PORT, () => console.log("running successfully"));
