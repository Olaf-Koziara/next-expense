import {NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

export async function middleware(req: Request) {
    const secret = process.env.NEXTAUTH_SECRET;

    const token = await getToken({req, secret});
    if (!token) {
        return NextResponse.redirect(new URL('/auth/signIn', req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],

}
