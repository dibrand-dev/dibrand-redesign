import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

let locales = ['en', 'es']
let defaultLocale = 'en'

function getLocale(request: NextRequest): string {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const headers = { 'accept-language': acceptLanguage };
    const languages = new Negotiator({ headers }).languages();

    // Strict rule: If browser accepts any form of Spanish, return 'es'. Otherwise default to 'en'.
    const wantsSpanish = languages.some((lang: string) => lang.toLowerCase().startsWith('es'));
    return wantsSpanish ? 'es' : 'en';
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // EXCLUDE STATIC ASSETS AND INTERNAL PATHS FROM ALL MIDDLEWARE
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/) ||
        pathname === '/favicon.ico' ||
        pathname === '/logo.png'
    ) {
        return NextResponse.next()
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. SUPABASE AUTH PROTECTION FOR /admin
    if (pathname.startsWith('/admin')) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )

        // Official strategy: getUser() is the only safe way to verify session in middleware
        const { data: { user } } = await supabase.auth.getUser()

        // Redirect to login if not authenticated and not already on the login page
        if (!user && pathname !== '/admin/login') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Redirect to panel if already authenticated and trying to access the login page
        if (user && pathname === '/admin/login') {
            return NextResponse.redirect(new URL('/admin/candidates', request.url))
        }

        return response
    }

    // 2. LOCALE REDIRECTION (For non-admin routes)
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return response

    // Redirect if there is no locale
    const locale = getLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - logo.png
         * - api
         */
        '/((?!_next/static|_next/image|favicon.ico|logo.png|api).*)',
    ],
}
