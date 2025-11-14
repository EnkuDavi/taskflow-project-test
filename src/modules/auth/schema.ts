import { t } from "elysia"

export const registerSchema = t.Object({
    email: t.Required(t.String({ format: 'email' })),
    password: t.Required(t.String({ minLength: 6 })),
    name: t.Required(t.String({ minLength: 3 }))
})