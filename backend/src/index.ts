import { Elysia } from "elysia";
import { loggerPlugin } from "./plugins/logger";
import { corsPlugin } from "./plugins/cors";
import { swaggerPlugin } from "./plugins/swagger";
import { jwtPlugin } from "./plugins/jwt";
import { authRoute } from "./modules/auth/route";
import { createErrorHandler } from "./common/error-handler";
import { taskRoute } from "./modules/task/route";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(loggerPlugin)
  .use(corsPlugin)
  .use(jwtPlugin)
  .use(authRoute)
  .use(taskRoute)
  .onError(createErrorHandler())
  .use(swaggerPlugin)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
