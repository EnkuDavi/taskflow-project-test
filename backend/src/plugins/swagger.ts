import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

export const swaggerPlugin = new Elysia().use(
    swagger({
        path: '/docs',
        documentation: {
            info: {
                title: 'Task Flow Management API',
                version: '1.0.0'
            }
        }
    })
)