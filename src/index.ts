import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { createGraphqlServer } from "./graphql";
import { UserService } from "./services/user";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
// ... previous import statements

const app = express();
const httpServer = createServer(app);

const PORT = 5000;
const corsOptions = {
  origin: true,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(async (req, res, next) => {
  const accessToken = req.cookies["access-token"];
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

    expressMiddleware(await createGraphqlServer(httpServer), {
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

httpServer.listen(PORT, () => console.log("running successfully"));
