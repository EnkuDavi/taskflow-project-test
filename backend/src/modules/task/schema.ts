import { Static, t } from "elysia";

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
