// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If authenticated user tries to access /admin/login, redirect to dashboard
    if (req.nextUrl.pathname === '/admin/login' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow login page without token
        if (req.nextUrl.pathname === '/admin/login') return true
        // All other /admin routes require a valid token
        if (req.nextUrl.pathname.startsWith('/admin')) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
