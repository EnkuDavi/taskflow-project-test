import { Elysia } from "elysia";
import { prismaPlugin } from "./plugins/prisma";

const app = new Elysia()
  .use(prismaPlugin).get("/users", async ({ prisma }) => {
    return prisma.user.findMany();
  }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
