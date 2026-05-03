import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/index.js";
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../config/env";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: false,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.APPLICANT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },

  plugins: [
    oAuthProxy(),
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "reset your password",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 5 * 60,
      otpLength: 6,
    }),
  ],
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID as string,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET as string,
      redirectURI: envVars.GOOGLE_CALLBACK_URL,
      mapProfileToUser: () => {
        return {
          role: Role.APPLICANT,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          needPasswordChange: false,
          isDeleted: false,
          deletedAt: null,
        };
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,

    cookiCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },




  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:5000",
    envVars.FRONTEND_URL,
  ],

  advanced: {
    // useSecureCookies: false,
    // cookiePrefix: "better-auth",
    // useSecureCookies: process.env.NODE_ENV === "production",
    // crossSubDomainCookies: {
    //   enabled: false,
    // },
    // disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)

    cookies: {
      session_token: {
        name: "better-auth.session_token",
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          partitioned: true,
          path: "/",
        },
      },

      state: {
        name: "better-auth.state",
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          // partitioned: true,
          path: "/",
        },
      },

    },
  },
});
