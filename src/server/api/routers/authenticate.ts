import { z } from "zod";

import { signUpSchema } from "../../../common/authSchema";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signUpSchema)
    .output(
      z.object({
        message: z.string(),
        status: z.number(),
        result: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        email,
        password,
        dob,
        nameTag,
        description,
        userTags,
        image,
      } = input;

      const emailExists = await ctx.prisma.user.findFirst({ where: { email } });
      if (emailExists) {
        throw new TRPCError({
          message: "User with this Email ID already exists",
          code: "FORBIDDEN",
        });
      }

      const nameTagExists = await ctx.prisma.user.findFirst({ where: { atTag : nameTag } });
      if (nameTagExists) {
        throw new TRPCError({
          message: "User with this Tag-name already exists",
          code: "FORBIDDEN",
        });
      }

      // NOTE: Your error handling is already synced from front-end and backend thanks to signUpSchema, on line 143 of sign-up.tsx all 
              // the server side errors are also being displyed.

      // TODO: In authSchema check userTags error and make sure they are not repeating and does not contain spaces.
      // TODO: Get the uploaded image file directly in sign-up page > Validate file, maybe through zod refine  
      // TODO: Upload image on supabase storage bucket > Get image URL > Store URL in user Table image field
      // TODO: Hash password here and pass to result like password : hashed_password


      const result = await ctx.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
          dateOfBirth: dob,
          atTag: nameTag,
          description: description,
          tags: {
            connectOrCreate: userTags.map((tag) => ({
              where: { name: tag.value },
              create: { name: tag.value },
            })),
          },
          image: image,
        },
      });

      return {
        message: "Account created successfully",
        status: 201,
        result: result.email,
      };
    }),
});
