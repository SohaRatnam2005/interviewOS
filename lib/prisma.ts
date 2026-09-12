import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma : PrismaClient| undefined ;

};//if i have a prisma client made already reuse it 

export const prisma = 
  globalForPrisma.prisma ?? 
  new PrismaClient();// if it does not exist , create it 

  if(process.env.NODE_ENV !== "production"){
    globalForPrisma.prisma = prisma ;
  }