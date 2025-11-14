import { AppError } from "./error";

export const requireUser = async ({ headers, jwt }: any) => {
  const authHeader = headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new AppError("Unauthorized", 401);

  const token = authHeader.replace("Bearer ", "");
  const payload = await jwt.verify(token);

  if (!payload) throw new AppError("Unauthorized", 401);

  return {
    user: {
      id: payload.sub,
      email: payload.email,
    },
  };
};
