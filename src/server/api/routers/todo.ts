import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.todo.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        completed: true,
      },
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
        name: z.string().min(1).optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input.id },
      })
      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found.",
        })
      }

      const updatedTodo = await ctx.prisma.todo.update({
        where: { id: input.id },
        data: {
          name: input.name,
          completed: input.completed,
        },
      })

      if (updatedTodo.completed) {
        await ctx.prisma.todo.delete({
          where: { id: input.id },
        })
      }

      return updatedTodo
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({
        where: { id: input },
      })
      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found.",
        })
      }
      return await ctx.prisma.todo.delete({
        where: { id: input },
      })
    }),
})
