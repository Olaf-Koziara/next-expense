import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";

export default auth((req) => {
    console.log(req.nextUrl.pathname)
    if (!req.auth && !req.nextUrl.pathname.includes('auth')) {

        return NextResponse.redirect(new URL('/auth/signIn', req.url))
    }
    return NextResponse.next();
})

export const config = {
    matcher: [
        '/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
