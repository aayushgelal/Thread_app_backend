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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const graphql_1 = require("./graphql");
const user_1 = require("./services/user");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
// ... previous import statements
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = 5000;
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies["access-token"];
    try {
        const user = yield user_1.UserService.decodeJWTToken(accessToken);
        req.userId = user.id;
    }
    catch (_a) { }
    next();
}));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express_1.default.json());
        app.use("/graphql", (0, express4_1.expressMiddleware)(yield (0, graphql_1.createGraphqlServer)(httpServer), {
            context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
                return { req, res };
                // try {,
                //   return { user };
                // } catch {}
            }),
        }));
    });
}
init();
app.get("/", (req, res) => {
    res.sendStatus(200).json({ message: "running successfully" });
});
httpServer.listen(PORT, () => console.log("running successfully"));
