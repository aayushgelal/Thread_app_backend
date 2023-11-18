import {
  CreatePostPayload,
  GetPostPayload,
  PostService,
} from "../../services/post";
import { DateTimeResolver } from "graphql-scalars";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

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
      { req, res }: any
    ) => {
      if (req.userId) {
        pubsub.publish("POST_CREATED", { postCreated: payload });
        console.log(pubsub);

        const Post = await PostService.createPost(payload);
        return Post;
      } else {
        throw new Error("Posted Without User");
      }
    },
  },
  subscription: {
    postCreated: {
      subscribe: () => {
        console.log("listening");

        return pubsub.asyncIterator(["POST_CREATED"]);
      },
    },
  },
};
