import { Prisma_Client } from "../../lib/db";
import {
  CreateUserPayload,
  GenerateJWTPayload,
  UserService,
} from "../../services/user";

export const resolvers = {
  queries: {
    getUserToken: async (_: any, payload: GenerateJWTPayload) => {
      const res = await UserService.generateJWTToken(payload);
      return res;
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
