import { NextResponse, type NextRequest } from 'next/server';

export const config = {
    matcher: ['/admin/:path*'],
};

const PUBLIC_ADMIN_PATHS = new Set([
    '/admin/login',
    '/admin/register',
    '/admin/approve-success',
    '/admin/approve-error',
]);

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();
    if (pathname.startsWith('/admin/approve/')) return NextResponse.next();

    const session = req.cookies.get('__session')?.value;
    if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}
