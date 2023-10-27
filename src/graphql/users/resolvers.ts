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
  },
  mutations: {
    createUser: async (_: any, payload: CreateUserPayload) => {
      const res = await UserService.createUser(payload);

      return res.id;
    },
  },
};
