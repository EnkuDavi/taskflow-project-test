import { Elysia } from 'elysia'
import { AuthService } from './service'
import { registerSchema } from './schema'
import { prisma } from '../../plugins/prisma'
import { success } from '../../common/success'

export const authRoute = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body }) => {
      const auth = new AuthService(prisma)
      const result = await auth.register(body)
      return success(result)
    },
    { body: registerSchema }
  )
