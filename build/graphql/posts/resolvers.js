"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const post_1 = require("../../services/post");
exports.resolvers = {
    queries: {
        getAllPosts: (_, payload, { req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.userId) {
                const Posts = yield post_1.PostService.getAllPosts();
                return Posts;
            }
        }),
    },
    mutation: {
        createPost: (_, payload, { req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.userId) {
                const Post = yield post_1.PostService.createPost(payload);
                return Post;
            }
            else {
                throw new Error("Posted Without User");
            }
        }),
    },
};
