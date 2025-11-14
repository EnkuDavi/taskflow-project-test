import { Elysia } from "elysia";
import { AuthService } from "./service";
import { loginSchema, registerSchema } from "./schema";
import { prisma } from "../../plugins/prisma";
import { success } from "../../common/success";
import { jwtPlugin } from "../../plugins/jwt";

export const authRoute = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
  .post(
    "/register",
    async ({ body }) => {
      const auth = new AuthService(prisma);
      const result = await auth.register(body);
      return success(result);
    },
    { body: registerSchema }
  )

  .post(
    "/login",
    async ({ body, jwt }) => {
      const service = new AuthService(prisma);
      const user = await service.validateLogin(body.email, body.password);

      const token = await jwt.sign({
        sub: user.id,
        email: user.email,
      });

      return {
        success: true,
        data: { token },
      };
    },
    { body: loginSchema }
  );
