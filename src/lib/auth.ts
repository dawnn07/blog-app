import {betterAuth} from "better-auth"
import {prismaAdapter} from "better-auth/adapters/prisma"
import prisma from "./prisma"
import { sendEmail } from "./email";
import {createAuthMiddleware, APIError} from "better-auth/api"
import { passwordSchema } from "./validation";
import { use } from "react";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
    },
    emailAndPassword: {
        enabled: true,
        async sendResetPassword({user, url}) {
          await sendEmail({
            to: user.email,
            subject: "Reset your password",
            text: `Click this link to reset your password: ${url}`
          });
        },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      async sendVerificationEmail({user, url}) {
        await sendEmail({
          to: user.email,
          subject: "Verify your email",
          text: `Click this link to verify your email: ${url}`
        });
      }
    },
    user: {
      changeEmail: {
        enabled: true,
        async sendChangeEmailVerification({user, url}) {
          await sendEmail({
            to: user.email,
            subject: "Verify your new email",
            text: `Click this link to verify your new email: ${url}`
          });
        }
      },
      additionalFields: {
        role: {
          type: "string",
          input: false,
        }
      }
    },
    hooks: {
      before: createAuthMiddleware(async ctx => {
        if (ctx.path === "/sign-up/email" || ctx.path === "/reset-password" || ctx.path === "/change-password") {
          const password = ctx.body.password || ctx.body.newPassword;
          const {error} = passwordSchema.safeParse(password);
          if(error) {
            throw new APIError("BAD_REQUEST", {
              message: error.message
            });
          }
        }
      })
    }
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user