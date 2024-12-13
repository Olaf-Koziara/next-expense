import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import {connectMongoDB} from "@/lib/mongodb";
import {User} from "./models/user";
import {GetServerSidePropsContext, NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                await connectMongoDB();
                const userFound = await User.findOne({
                    email: credentials?.email,
                })
                console.log(userFound)

                if (!userFound) throw new Error("Invalid Email");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    userFound.password
                );

                if (!passwordMatch) throw new Error("Invalid Password");
                return userFound;
            },
        }),
    ],
    pages: {
        signIn: "/login",
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

            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    phone: u.phone,
                };
            }
            return token;
        },
        async session({session, token}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token.id,
                    name: token.name,
                    phone: token.phone,
                }
            };
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