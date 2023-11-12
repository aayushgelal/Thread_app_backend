import JWT from "jsonwebtoken";
import { Prisma_Client } from "../lib/db";
import { createHmac, randomBytes } from "crypto";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
}
export interface GenerateJWTPayload {
  email: string;
  password: string;
}
const JWTSECRETKEY = "superman@11";

export class UserService {
  private static getUserbyMail(email: string) {
    return Prisma_Client.user.findUnique({ where: { email: email } });
  }
  private static generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password, username } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashed_password = UserService.generateHash(salt, password);
    return Prisma_Client.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed_password,
        username,
        salt,
      },
    });
  }
  public static async generateJWTToken(payload: GenerateJWTPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserbyMail(email);
    if (!user) {
      throw new Error("error user not found");
    }
    const salt = user.salt;

    const hashed_password = UserService.generateHash(salt, password);
    if (hashed_password != user.password) {
      throw new Error("the password is wrong");
    }
    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageURL: user.profileImageUrl,
        username: user.username,
      },
      JWTSECRETKEY
    );
    return token;
  }
  public static async decodeJWTToken(payload: string) {
    return JWT.verify(payload, JWTSECRETKEY);
  }
  public static findUser(payload: string) {
    return Prisma_Client.user.findUnique({
      where: {
        id: payload,
      },
    });
  }
}
