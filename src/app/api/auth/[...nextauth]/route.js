// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { adminDb } from "@/lib/firebase-admin"

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            // 👇 We added this section to ask for the 'guilds' permission!
            authorization: {
                params: { scope: 'identify email guilds' }
            },
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    adapter: FirestoreAdapter(adminDb),
    session: {
        strategy: "jwt", // Fast & saves database queries on every page render
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Trust the URL (fixes issues when accessing via local network IP instead of localhost)
            return url
        },
        async session({ session, token }) {
            // Attach the user's ID to the session object
            if (session?.user && token?.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }