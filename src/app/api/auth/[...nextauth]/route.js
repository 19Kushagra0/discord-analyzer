// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            // 👇 We added this section to ask for the 'guilds' permission!
            authorization: {
                params: { scope: 'identify email guilds' }
            }
        }),
    ],
    pages: {
        signIn: '/login',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }