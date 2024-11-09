import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('_auth')?.value

  if (!authToken && request.nextUrl.pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (authToken && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/galeria', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}