import { Redis } from "@upstash/redis";
import { PrismaClient } from "../prisma/generated/prisma";
import express, {Express} from "express"
const prisma = new PrismaClient();
const app:Express = express();
const port = 5032;
const redis = Redis.fromEnv()
async function  GetRevisonAndPush_Queue() {
  const data = await prisma.revision.findMany({
    select:{
        topic:true,
        id:true,
        email:true
    }
  })
  const pushReminder = await redis.rpush("Reminder", JSON.stringify(data))
  console.log(pushReminder)
  console.log(data)  
} 
GetRevisonAndPush_Queue()



app.listen(port, ()=>{
    console.log(`listing on port nuumber ${port}`)
})