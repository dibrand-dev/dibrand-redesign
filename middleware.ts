import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const locales = ['en', 'es']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
    // 1. Preferencia por COOKIE (Persistencia manual)
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
        return cookieLocale;
    }

    // 2. Detección por HEADERS (Preferencia del navegador)
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

    // REGLA: Si algún idioma empieza por 'es', es Español.
    const isSpanish = languages.some(lang => lang.toLowerCase().startsWith('es'));

    if (isSpanish) {
        return 'es';
    }

    // Fallback: Inglés para todo lo demás
    return defaultLocale;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isApiRoute = pathname.startsWith('/api')
    const isStaticAsset = pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|pdf|txt|xml|json)$/) || 
                         pathname.startsWith('/_next') || 
                         pathname === '/favicon.ico' || 
                         pathname === '/logo.png'

    // 0. IMMEDIATE EXCLUSION FOR API AND STATIC ASSETS
    if (isApiRoute || isStaticAsset) {
        return NextResponse.next()
    }

    // 1. SUPABASE AUTH PROTECTION FOR /admin AND /ats
    if (pathname.startsWith('/admin') || pathname.startsWith('/ats')) {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({ name, value, ...options })
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        })
                        response.cookies.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({ name, value: '', ...options })
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        })
                        response.cookies.set({ name, value: '', ...options })
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // Auth Logic
        if (!user) {
            if (pathname === '/admin/login' || pathname === '/ats/login') {
                return response;
            }
            const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/ats/login';
            return NextResponse.redirect(new URL(loginPath, request.url));
        }

        if (user) {
            if (pathname === '/admin/login') {
                return NextResponse.redirect(new URL('/admin/candidates', request.url));
            }
            if (pathname === '/ats/login') {
                return NextResponse.redirect(new URL('/ats', request.url));
            }
        }

        return response
    }

    // 2. PROTECT NON-GET REQUESTS FROM i18n REDIRECTS (Critical for Server Actions and APIs)
    // Applying a redirect to a POST/PUT request will cause the body to be lost.
    if (request.method !== 'GET') {
        return NextResponse.next()
    }

    // 3. LOCALE REDIRECTION (For non-admin, non-api, non-static GET routes)
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|oficina-dibrand.png|logo_dibrand.svg|logo.png|.*\\.png|.*\\.svg).*)'],
}
