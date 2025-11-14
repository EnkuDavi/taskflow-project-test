import type { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../common/error";
import { CreateTaskDto, TaskQuerySchemaDto, UpdateTaskDto } from "./schema";
import { paginate } from "../../common/paginate";

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  async list(userId: string, query: TaskQuerySchemaDto) {
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(query.status && { status: query.status }),
    };

    return await paginate(this.prisma.task, query, {
      where,
      orderBy: { createdAt: "desc" },
      search: {
        fields: ["title", "description"],
      },
    });
  }

  async create(userId: string, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async detail(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task || task.userId !== userId)
      throw new AppError("Task not found", 404);

    return task;
  }

  async update(userId: string, taskId: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task || task.userId !== userId)
      throw new AppError("Task not found", 404);

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async delete(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task || task.userId !== userId)
      throw new AppError("Task not found", 404);

    await this.prisma.task.delete({ where: { id: taskId } });

    return { success: true };
  }
}
