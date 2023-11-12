"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const db_1 = require("../lib/db");
class PostService {
    static createPost(payload) {
        var _a;
        return db_1.Prisma_Client.post.create({
            data: {
                post: payload.post,
                userId: payload.username,
                imageLink: (_a = payload.imageLink) !== null && _a !== void 0 ? _a : null,
                likes: 0,
            },
        });
    }
    static getAllPosts() {
        return db_1.Prisma_Client.post.findMany();
    }
}
exports.PostService = PostService;
