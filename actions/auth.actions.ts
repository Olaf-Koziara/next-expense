"use server" // 開頭統一加上"use server"即可
import {getServerSession} from 'next-auth/next'
import {Account, Profile} from "next-auth"
import {redirect} from "next/navigation"
import bcrypt from "bcryptjs"
import {User} from "@/models/user"
import {connectMongoDB} from "@/lib/mongodb";
import {authOptions} from "@/auth";


export async function getUserSession() {
    return await getServerSession(authOptions)
}

interface ExtendedProfile extends Profile {
    picture?: string
}

interface SignInWithOauthParams {
    account: Account,
    profile: ExtendedProfile
}

export async function signInWithOauth({
                                          account,
                                          profile
                                      }: SignInWithOauthParams) {
    await connectMongoDB()

    const user = await User.findOne({email: profile.email})

    if (user) return true

    const newUser = new User({
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        provider: account.provider
    })

    await newUser.save()

    return true
}

interface GetUserByEmailParams {
    email: string
}

export async function getUserByEmail({
                                         email
                                     }: GetUserByEmailParams) {
    await connectMongoDB()

    const user = await User.findOne({email}).select("-password")

    if (!user) {
        throw new Error("User does not exist!")
    }

    // console.log({user})
    return {...user._doc, _id: user._id.toString()}
}

export interface UpdateUserProfileParams {
    name: string
}

export async function updateUserProfile({
                                            name
                                        }: UpdateUserProfileParams) {
    const session = await getServerSession(authOptions)
    // console.log(session)

    await connectMongoDB()

    try {
        if (!session) {
            throw new Error("Unauthorization!")
        }

        const user = await User.findByIdAndUpdate(session?.user?._id, {
            name
        }, {new: true}).select("-password")

        if (!user) {
            throw new Error("User does not exist!")
        }

        return {success: true}
    } catch (error) {
        redirect(`/error?error=${(error as Error).message}`)
    }
}

export interface SignUpWithCredentialsParams {
    name: string,
    email: string,
    password: string
}

export async function signUpWithCredentials({
                                                name,
                                                email,
                                                password
                                            }: SignUpWithCredentialsParams) {
    await connectMongoDB()

    try {
        const user = await User.findOne({email})

        if (user) {
            throw new Error("User already exists.")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        return {success: true}
    } catch (error) {
        redirect(`/error?error=${(error as Error).message}`)
    }
}

interface SignInWithCredentialsParams {
    email: string,
    password: string
}

export async function signInWithCredentials({
                                                email,
                                                password
                                            }: SignInWithCredentialsParams) {
    await connectMongoDB()

    const user = await User.findOne({email})

    if (!user) {
        throw new Error("Invalid email or password!")
    }

    const passwordIsValid = await bcrypt.compare(
        password,
        user.password
    )

    if (!passwordIsValid) {
        throw new Error("Invalid email or password")
    }

    return {email: user.email, name: user.name, _id: user._id.toString()}
}

export interface ChangeUserPasswordParams {
    oldPassword: string,
    newPassword: string
}

export async function changeUserPassword({
                                             oldPassword,
                                             newPassword
                                         }: ChangeUserPasswordParams) {
    const session = await getServerSession(authOptions)

    await connectMongoDB()

    try {
        if (!session) {
            throw new Error("Unauthorization!")
        }

        if (session?.user?.provider !== "credentials") {
            throw new Error(`Signed in via ${session?.user?.provider}. Changes not allowed with this method.`)
        }

        const user = await User.findById(session?.user?._id)

        if (!user) {
            throw new Error("User does not exist!")
        }

        const passwordIsValid = await bcrypt.compare(
            oldPassword,
            user.password
        )

        if (!passwordIsValid) {
            throw new Error("Incorrect old password.")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        return {success: true}
    } catch (error) {
        redirect(`/error?error=${(error as Error).message}`)
    }
}