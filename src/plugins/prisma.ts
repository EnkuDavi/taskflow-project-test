import { PrismaClient } from "@prisma/client";
import Elysia from "elysia";

const prisma = new PrismaClient()

export const prismaPlugin = new Elysia().decorate("prisma", prisma)