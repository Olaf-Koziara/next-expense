import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
    '/api',
    '/auth',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/sitemap.xml',
    '/robots.txt',
];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    if (PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))) {
        return NextResponse.next();
    }

    try {
        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) {
            throw new Error('NEXTAUTH_SECRET is not defined');
        }

        const token = await getToken({ req: request, secret,    secureCookie: process.env.NODE_ENV === 'production',

        });
        if (!token) {
            const signInUrl = new URL('/auth/signIn', request.url);
            signInUrl.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(signInUrl);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/auth/signIn', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
