import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      orderBy: { createdAt: "asc" },
    })
  }),

  create: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          name: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
      return todo
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean().optional(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const uniqueTodo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      })
      if (!uniqueTodo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found.",
        })
      }
      const todo = await ctx.prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed, name: input.name },
      })
      return todo
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const uniqueTodo = await ctx.prisma.todo.findUnique({
        where: { id: input },
      })
      if (!uniqueTodo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found.",
        })
      }
      return await ctx.prisma.todo.delete({
        where: { id: input },
      })
    }),

  deleteMany: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.todo.deleteMany({
      where: { completed: true },
    })
  }),
})
