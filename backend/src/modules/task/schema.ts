import { Static, t } from "elysia";
import { paginationMetaSchema, paginationQuerySchema } from "../../common/pagination";

export const createTaskSchema = t.Object({
  title: t.String(),
  description: t.Optional(t.String()),
});

export type CreateTaskDto = Static<typeof createTaskSchema>;

export const updateTaskSchema = t.Object({
  title: t.Optional(t.String()),
  description: t.Optional(t.String()),
  status: t.Optional(
    t.Enum({
      pending: "pending",
      in_progress: "in_progress",
      completed: "completed",
    })
  ),
});

export type UpdateTaskDto = Static<typeof updateTaskSchema>;

export const taskQuerySchema = t.Object({
  ...paginationQuerySchema.properties,
  status: t.Optional(t.Enum({ pending: "pending", in_progress: "in_progress", completed: "completed" })), 
});

export type TaskQuerySchemaDto = Static<typeof taskQuerySchema>;


// Sample response swagger 
export const taskItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Nullable(t.String()),
  status: t.String(),
  userId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const taskResponse = t.Object({
  success: t.Boolean(),
  data: taskItemSchema
})


export const taskDeleteResponse = t.Object({
  success: t.Boolean(),
  data: t.Object({
    success: t.Boolean(),
  })
})

export const taskPaginatedResponse = t.Object({
  success: t.Boolean(),
  message: t.String(),
  data: t.Array(taskItemSchema),
  meta: paginationMetaSchema,
});


