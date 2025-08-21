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
const redis_1 = require("@upstash/redis");
const prisma_1 = require("../prisma/generated/prisma");
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const prisma = new prisma_1.PrismaClient();
const app = (0, express_1.default)();
const port = 5032;
const redis = redis_1.Redis.fromEnv();
function GetRevisonAndPush_Queue() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield prisma.revision.findMany({
            select: {
                topic: true,
                id: true,
                email: true
            }
        });
        const pushReminder = yield redis.rpush("Reminder", JSON.stringify(data));
        console.log(pushReminder);
        console.log(data);
    });
}
node_cron_1.default.schedule('00 5  * * * ', () => __awaiter(void 0, void 0, void 0, function* () {
    const push = yield GetRevisonAndPush_Queue();
    console.log(push);
}));
app.listen(port, () => {
    console.log(`listing on port nuumber ${port}`);
});
