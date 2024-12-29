import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {GetServerSidePropsContext, NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {signInWithCredentials, signInWithOauth} from "@/actions/auth.actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
            profile: (profile) => signInWithOauth(profile, 'google'),
        }),
        CredentialsProvider({
                name: "Credentials",
                id: "credentials",
                credentials: {
                    email: {label: "Email", type: "text"},
                    password: {label: "Password", type: "password"},
                },

                authorize: (credentials) => signInWithCredentials(credentials)
            }
        ),
    ],
    pages: {
        error: "/signIn",

    },
    session: {
        strategy: "jwt",
    },
    callbacks: {

        async jwt({token, user, session, trigger}) {

            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }

            if (trigger === "update" && session?.email) {
                token.email = session.email;
            }


            return token;
        },
        async session({session, token}) {
            if (token) {
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

export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions)
}