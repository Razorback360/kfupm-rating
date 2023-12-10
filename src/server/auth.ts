import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

import AzureADProvider, {
  type AzureADProfile,
} from "next-auth/providers/azure-ad";
import { type Role } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    email: string;

    role: Role;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === "development",
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    AzureADProvider({
      id: "azure-ad",
      name: "Microsoft",
      clientId: env.AZURE_AD_B2C_CLIENT_ID,
      clientSecret: env.AZURE_AD_B2C_CLIENT_SECRET,
      wellKnown: `https://login.microsoftonline.com/${env.AZURE_AD_B2C_TENANT_NAME}/v2.0/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope:
            "openid profile email offline_access user.Read People.Read User.ReadBasic.All",
        },
      },
      idToken: true,
      // TODO @SauceX22: change this proper MSFT logos
      style: {
        logo: "https://authjs.dev/img/providers/azure.svg",
        logoDark: "https://authjs.dev/img/providers/azure-dark.svg",
        bg: "#fff",
        text: "#0072c6",
        bgDark: "#0072c6",
        textDark: "#fff",
      },
      async profile(profile: AzureADProfile, tokens) {
        const profileObject = {
          id: profile.sub,
          name: profile.nickname,
          email: profile.email,
          image: profile.picture,
          // NOT SURE OF DATA (Updated in session callback later)
          // role: assinged down below
        };
        // https://learn.microsoft.com/en-us/graph/api/profile-get?view=graph-rest-beta&tabs=http#example-1-get-a-users-profile
        if (
          (!profileObject.name || !profileObject.email) &&
          tokens.access_token
        ) {
          const profileData = await fetch(
            `https://graph.microsoft.com/beta/me/profile`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                contentType: "application/json",
              },
            },
          );
          if (profileData.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const profileJson = await profileData.json();
            if (!profileObject.name) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              profileObject.name = profileJson.names[0].displayName;
            }
            if (!profileObject.email) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              profileObject.email = profileJson.emails[0].address;
            }
          }
        } else {
          throw new Error("NO ACCESS TOKEN: Unable to fetch profile data");
        }
        // https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
        if (!profileObject.image && tokens.access_token) {
          const profilePicture = await fetch(
            `https://graph.microsoft.com/v1.0/me/photos/64x64/$value`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            },
          );
          if (profilePicture.ok) {
            const pictureBuffer = await profilePicture.arrayBuffer();
            const pictureBase64 = Buffer.from(pictureBuffer).toString("base64");
            profileObject.image = `data:image/jpeg;base64, ${pictureBase64}`;
          }
        } else {
          // its fine if the user doesn't have a profile picture
          console.error("NO ACCESS TOKEN: Unable to fetch profile picture");
        }
        // if profile still has no name or email, throw an error
        if (!profileObject.name || !profileObject.email) {
          throw new Error("NO NAME OR EMAIL: Unable to fetch profile data");
        }
        // TODO @SauceX22 validate if the user is an admin through their id with known admin ids
        return {
          ...profileObject,
          role: "USER",
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
