"use server"
import {Profile} from "next-auth"
import {redirect} from "next/navigation"
import bcrypt from "bcryptjs"
import {User} from "@/models/user"
import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {OAuthProviderType} from "@auth/core/providers";


interface ExtendedProfile extends Profile {
    picture?: string
}

export async function signInWithOauth(profile: ExtendedProfile, provider: OAuthProviderType) {
    await connectMongoDB()
    if (!profile.email) return Promise.reject();
    const user = await getUserByEmail(profile.email)

    if (!user) {
        const newUser = new User({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            provider
        })

        await newUser.save()
    }

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
    };

}


export async function getUserByEmail(email?: string, select = '') {
    if (!email) return;
    await connectMongoDB()

    const user = await User.findOne({email}).select(select)

    if (!user) {
        return null;
    }

    return {...user._doc, _id: user._id.toString()}
}

export interface UpdateUserProfileParams {
    name: string
}

export async function updateUserProfile({
                                            name
                                        }: UpdateUserProfileParams) {
    const session = await auth();
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
    console.log(email)
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

type Credentials = Record<"email" | "password", string> | undefined;

export async function signInWithCredentials(credentials: Partial<Record<"email" | "password", string>>) {

    if (!credentials || !credentials.password || !credentials.email) {
        throw new Error("Invalid credentials")
    }
    const {email, password} = credentials;
    console.log(email)
    if (!email) {
        throw new Error("Invalid email")

    }
    await connectMongoDB()
    const user = await getUserByEmail(email)

    if (!user) {
        throw new Error("Invalid email")
    }


    const passwordIsValid = await bcrypt.compare(
        password,
        user.password
    )

    if (!passwordIsValid) {
        throw new Error("Invalid password2")
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
    const session = await auth();

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