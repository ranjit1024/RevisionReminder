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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const redis_1 = require("@upstash/redis");
const client_s3_1 = require("@aws-sdk/client-s3");
const client_ses_1 = require("@aws-sdk/client-ses");
const redis = redis_1.Redis.fromEnv();
const s3 = new client_s3_1.S3Client({
    region: String(process.env.AWS_REGION),
    credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    },
    maxAttempts: 5,
    retryMode: 'adaptive'
});
const sesClient = new client_ses_1.SESClient({ region: String(process.env.AWS_REGION) });
function PutSessionReminderInquque() {
    return __awaiter(this, void 0, void 0, function* () {
        const revisionData = yield prisma.revision.findMany({
            select: {
                id: true,
                topic: true,
                time: true,
                email: true
            },
        });
        // const sendRevisionReminder = await redis.lpush('reminder', JSON.stringify(revisionData));
        console.log(revisionData);
        return revisionData;
    });
}
PutSessionReminderInquque();
const createSendEmailCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    return new client_ses_1.SendEmailCommand({
        Destination: {
            ToAddresses: ["ranjitdas2048@gmail.com"]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "<h1>remider</h1>",
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: 'fasdf'
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: "Reminder for Subject"
            }
        },
        Source: 'ranjitdas3048@gmail.com'
    });
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const comand = yield createSendEmailCommand();
            const result = yield sesClient.send(comand);
            console.log(result);
        }
        catch (err) {
            console.log(err);
        }
    });
}
run();
