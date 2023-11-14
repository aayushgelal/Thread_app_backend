import {
  CreatePostPayload,
  GetPostPayload,
  PostService,
} from "../../services/post";
import { DateTimeResolver } from "graphql-scalars";

export const resolvers = {
  DateTime: DateTimeResolver,

  queries: {
    getAllPosts: async (_: any, payload: any, { req, res }: any) => {
      if (req.userId) {
        const Posts = await PostService.getAllPosts();
        return Posts;
      }
    },
  },
  mutation: {
    createPost: async (
      _: any,
      payload: CreatePostPayload,
      { req, res, pubsub }: any
    ) => {
      if (req.userId) {
        pubsub.publish("POST_CREATED", { postCreated: payload });

        const Post = await PostService.createPost(payload);
        return Post;
      } else {
        throw new Error("Posted Without User");
      }
    },
  },
  subscription: {
    postCreated: {
      subscribe: (_: any, { pubsub }: any) =>
        pubsub.asyncIterator(["POST_CREATED"]),
    },
  },
};
