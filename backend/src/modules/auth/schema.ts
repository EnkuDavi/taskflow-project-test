import { t } from "elysia";

export const registerSchema = t.Object({
  email: t.Required(t.String({ format: "email" })),
  password: t.Required(t.String({ minLength: 6 })),
  name: t.Required(t.String({ minLength: 3 })),
});

export const loginSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
});

// Sample response swagger
export const registResponse = t.Object({
  success: t.Boolean(),
  data: t.Object({
    id: t.String(),
    email: t.String(),
    name: t.String(),
  }),
});

export const loginResponse = t.Object({
  success: t.Boolean(),
  data: t.Object({
    token: t.String(),
  }),
});
