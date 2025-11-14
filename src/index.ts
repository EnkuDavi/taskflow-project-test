import { Elysia } from "elysia";
import { loggerPlugin } from "./plugins/logger";
import { corsPlugin } from "./plugins/cors";
import { swaggerPlugin } from "./plugins/swagger";
import { jwtPlugin } from "./plugins/jwt";
import { authRoute } from "./modules/auth/route";
import { createErrorHandler } from "./common/error-handler";

const app = new Elysia()
  .use(loggerPlugin)
  .use(corsPlugin)
  .use(swaggerPlugin)
  .use(jwtPlugin)
  .use(authRoute)
  .onError(createErrorHandler())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
