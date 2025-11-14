import { Elysia } from 'elysia'
import { createTaskSchema, taskDeleteResponse, taskPaginatedResponse, taskQuerySchema, taskResponse, updateTaskSchema } from './schema'
import { TaskService } from './service'
import { requireUser } from '../../common/auth-middleware'
import { prisma } from '../../plugins/prisma'
import { success } from '../../common/success'

export const taskRoute = new Elysia({ prefix: "/tasks" })
  .derive(requireUser)

  .get(
    "/",
    async ({ user, query }) => {
      const service = new TaskService(prisma);
      const result = await service.list(user.id, query);
      return success(result);
    },
    { 
      query: taskQuerySchema,
      response: taskPaginatedResponse
    }
  )

  .post(
    "/",
    async ({ user, body }) => {
      const service = new TaskService(prisma);
      const result = await service.create(user.id, body);
      return success(result);
    },
    { 
      body: createTaskSchema,
      response: {
        200: taskResponse
      }
    }
  )

  .get("/:id", async ({ user, params }) => {
    const service = new TaskService(prisma);
    const result = await service.detail(user.id, params.id);
    return success(result);
  }, {
    response: {
      200: taskResponse
    }
  })

  .patch(
    "/:id",
    async ({ user, params, body }) => {
      const service = new TaskService(prisma);
      const result = await service.update(user.id, params.id, body);
      return success(result);
    },
    { 
      body: updateTaskSchema,
      response: {
        200: taskResponse
      }
    }
  )

  .delete("/:id", async ({ user, params }) => {
    const service = new TaskService(prisma);
    const result = await service.delete(user.id, params.id);
    return success(result);
  }, {
    response: {
      200: taskDeleteResponse
    }
  });
