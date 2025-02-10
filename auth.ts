import NextAuth, {NextAuthConfig} from "next-auth";
import {signInWithCredentials, signInWithOauth} from "@/actions/auth.actions";
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"


export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
            profile: (profile) => signInWithOauth(profile, 'google'),
        }),
        Credentials({
                name: "Credentials",
                id: "credentials",
                credentials: {
                    email: {label: "Email", type: "text"},
                    password: {label: "Password", type: "password"},
                },

                authorize: (credentials) => signInWithCredentials(credentials as Partial<Record<"email" | "password", string>>)
            }
        ),
    ],
    pages: {
        error: "/signIn",
        signIn: '/auth/signIn',

    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {

        async jwt({token, session, trigger}) {
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }

            if (trigger === "update" && session?.email) {
                token.email = session.email;
            }


            return token;
        },
        async session({session, token}) {
            if (token.email) {
                session.user = {
                    ...session.user,
                    name: token.name,
                    email: token.email,
                };
            }
            return session;
        },

    },
};

export const {auth, handlers: {GET, POST}, signIn, signOut} = NextAuth(authConfig)