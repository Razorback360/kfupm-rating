import { Type } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const submissionRouter = createTRPCRouter({
  submit: publicProcedure
    .input(z.object({ title: z.string(), area: z.string(), description: z.optional(z.string()), name: z.optional(z.string()), phone: z.optional(z.string()), email: z.optional(z.string()), rating: z.optional(z.number()), type: z.string()}))
    .mutation(async ({ ctx, input }) => {
      const type: Type = input.type.toUpperCase() as Type
      
      await ctx.db.submission.create({
        data:{
          title: input.title,
          rating: input.rating,
          notes: input.description,
          department: input.area,
          type: type,
          visitor: input.name || input.phone || input.email ? {create: {
            email: input.email,
            phone: input.phone,
            name: input.name
          }} : undefined
        }
      })

      return {
        error: false,
        message: "Recorded"
      };
    }),

  submitLoggedIn: protectedProcedure
  .input(z.object({ title: z.string(), area: z.string(), description: z.optional(z.string()), name: z.optional(z.string()), phone: z.optional(z.string()), email: z.optional(z.string()), rating: z.optional(z.number()), type: z.string()}))
  .mutation(async ({ ctx, input }) => {
    
    let type: Type;
    switch(input.type){
      case "evaluation": type = "EVALUATION"; break;
      case "note": type = "NOTE"; break;
      case "complaint": type = "COMPLAINT"; break;
      case "suggestion": type = "SUGGESTION"; break;
      case "other": type = "OTHER"; break;
      default: type = "EVALUATION"; break;
    }

    await ctx.db.submission.create({
      data:{
        title: input.title,
        rating: input.rating,
        notes: input.description,
        department: input.area,
        type: type,
        userId: ctx.session.user.id
      }
    })

    return {
      error: false,
      message: "Recorded"
    };
  }),
  submissions: protectedProcedure
  .query(async ({ctx}) => {
    if(ctx.session.user.role === "ADMIN"){
      const submissions = await ctx.db.submission.findMany({
        include: {
          visitor: true,
          User: true
        }
      })
      return submissions
    }
  })
});
