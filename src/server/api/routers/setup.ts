import { Type } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const setupRouter = createTRPCRouter({
  status: publicProcedure
  .query(async({ctx}) => {
    const admin = await ctx.db.user.findFirst({
        where:{
            role: "ADMIN"
        }
    })
    return {status: admin ? true : false}
  })
});
