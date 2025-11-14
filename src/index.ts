import { Elysia } from "elysia";
import { prismaPlugin } from "./plugins/prisma";
import { loggerPlugin } from "./plugins/logger";
import { corsPlugin } from "./plugins/cors";
import { swaggerPlugin } from "./plugins/swagger";
import { jwtPlugin } from "./plugins/jwt";

const app = new Elysia()
  .use(loggerPlugin)
  .use(corsPlugin)
  .use(swaggerPlugin)
  .use(jwtPlugin)
  .use(prismaPlugin)
  .get("/users", async ({ prisma }) => {
    return prisma.user.findMany();
  }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
