import { Prisma_Client } from "../../lib/db";
import {
  CreateUserPayload,
  GenerateJWTPayload,
  UserService,
} from "../../services/user";

export const resolvers = {
  queries: {
    UserLogin: async (
      _: any,
      payload: GenerateJWTPayload,
      { req, res }: any
    ) => {
      const token = await UserService.generateJWTToken(payload);

      res.cookie("access-token", token, {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
      });
      const user = await UserService.decodeJWTToken(token as string);

      return user;
    },
    getCurrentUserLoggedIn: async (_: any, params: null, context: any) => {
      if (context.user) {
        const user = await UserService.findUser(context.user.id);
        return { ...user };
      }
      throw new Error("Who are you??");
    },
  },
  mutations: {
    createUser: async (_: any, payload: CreateUserPayload) => {
      const res = await UserService.createUser(payload);

      return res.id;
    },
  },
};
