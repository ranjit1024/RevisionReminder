import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Redis } from "@upstash/redis";
import { S3Client } from "@aws-sdk/client-s3"
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"
const redis = Redis.fromEnv()


const s3 = new S3Client({
    region: String(process.env.AWS_REGION),
    credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    },
    maxAttempts: 5,
    retryMode: 'adaptive'

})
const sesClient = new SESClient({ region: String(process.env.AWS_REGION) });
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
    // const sendRevisionReminder = await redis.lpush('reminder', JSON.stringify(revisionData));
    console.log(revisionData)
    return revisionData;
}
PutSessionReminderInquque()
const createSendEmailCommand = async () => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: ["ranjitdas2048@gmail.com"]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "<h1>remider</h1>",
                },
                Text:{
                    Charset:'UTF-8',
                    Data:'fasdf'
                },
            
            },
            Subject:{
                Charset:'UTF-8',
                Data:"Reminder for Subject"
            }
        },
        Source:'ranjitdas3048@gmail.com'
    })
}

async function run(){
    try{
            const comand = await createSendEmailCommand()
         const result = await sesClient.send(comand);
         console.log(result)
    }
    catch(err){
        console.log(err)
    }
}
run()