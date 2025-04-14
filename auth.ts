import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  })],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {id:profile?.id});
        if (!existingUser) {
          await writeClient.createIfNotExists({
            _type: "author",
            _id: `github-${profile.id}`,
            githubId: profile.id,
            name: user?.name,
            username: profile?.login,
            email: user?.email,
            image: user?.image,
            bio: profile?.bio || "",
          });
          return true;
        }
          
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, profile }) {
      if (profile) {
        try {
          const user = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile.id, 
          });
    
          if (user) {
            token.id = user._id;;
          }
    
          return token;
        } catch (error) {
          console.error("Error in jwt callback:", error);
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token?.id) {
        session.userId = token.id; 
      }
      return session;
    }
  },
});
