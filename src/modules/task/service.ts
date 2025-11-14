import type { PrismaClient } from "@prisma/client";
import { AppError } from "../../common/error";
import { CreateTaskDto, UpdateTaskDto } from "./schema";

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  async list(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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
