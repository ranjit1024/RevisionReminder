import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv()

async function PutSessionReminderInquque(): Promise<{
    time: Date;
    id: string,
    topic: string
    email: string
}[]> {
    const revisionData = await prisma.revision.findMany({
        select: {
            id: true,
            topic: true,
            time: true,
            email: true
        },

    });
    redis.lpush('reminder', JSON.stringify(revisionData))
    console.log(revisionData)
    return revisionData;
}
PutSessionReminderInquque()
