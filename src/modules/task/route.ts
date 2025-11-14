import { Elysia } from 'elysia'
import { createTaskSchema, updateTaskSchema } from './schema'
import { TaskService } from './service'
import { requireUser } from '../../common/auth-middleware'
import { prisma } from '../../plugins/prisma'
import { success } from '../../common/success'

export const taskRoute = new Elysia({ prefix: '/tasks' })
  .derive(requireUser)

  .get('/', async ({ user }) => {
    const service = new TaskService(prisma)
    const result = await service.list(user.id)
    return success(result)
  })

  .post(
    '/',
    async ({ user, body }) => {
      const service = new TaskService(prisma)
      const result = await service.create(user.id, body)
      return success(result)
    },
    { body: createTaskSchema }
  )

  .get('/:id', async ({ user, params }) => {
    const service = new TaskService(prisma)
    const result = await service.detail(user.id, params.id)
    return success(result)
  })

  .patch(
    '/:id',
    async ({ user, params, body }) => {
      const service = new TaskService(prisma)
      const result = await service.update(user.id, params.id, body)
      return success(result)
    },
    { body: updateTaskSchema }
  )

  .delete('/:id', async ({ user, params }) => {
    const service = new TaskService(prisma)
    const result = await service.delete(user.id, params.id)
    return success(result)
  })
