import { Prisma_Client } from "../lib/db";

export interface CreatePostPayload {
  username: string;
  post: string;
  imageLink?: string;
}
export interface GetPostPayload {
  username: string;
  post: string;
  imageLink: string;
  likes: number;
}
export class PostService {
  public static createPost(payload: CreatePostPayload) {
    return Prisma_Client.post.create({
      data: {
        post: payload.post,
        userId: payload.username,
        imageLink: payload.imageLink ?? null,
        likes: 0,
      },
    });
  }
  public static getAllPosts() {
    return Prisma_Client.post.findMany();
  }
}
