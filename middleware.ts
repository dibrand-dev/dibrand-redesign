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

    // 0. SUPABASE AUTH PROTECTION FOR /admin (Handle this BEFORE any i18n logic)
    if (pathname.startsWith('/admin')) {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
        if (!user && pathname !== '/admin/login') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        if (user && pathname === '/admin/login') {
            return NextResponse.redirect(new URL('/admin/candidates', request.url))
        }

        return response
    }

    // EXCLUDE STATIC ASSETS AND INTERNAL PATHS
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

    // 2. LOCALE REDIRECTION (For non-admin routes)
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|oficina-dibrand.png|logo_dibrand.svg|logo.png|.*\\.png|.*\\.svg).*)'],
}
