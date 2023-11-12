import {
  CreatePostPayload,
  GetPostPayload,
  PostService,
} from "../../services/post";

export const resolvers = {
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
        const Post = await PostService.createPost(payload);
        return Post;
      } else {
        throw new Error("Posted Without User");
      }
    },
  },
};
