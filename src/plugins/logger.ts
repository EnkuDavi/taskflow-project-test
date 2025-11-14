import { logger } from "@bogeychan/elysia-logger";
import Elysia from "elysia";

export const loggerPlugin = new Elysia().use(
    logger({
        level: 'info',
        timestamp: true,
        transport: {
            target: 'pino-pretty',
            options: { colorize: true }
        }
    })
)