import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 認証が必要なページのパス
const protectedCustomerPaths = ['/dashboard']
const protectedAdminPaths = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 顧客向けページの認証チェック
  if (protectedCustomerPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      // ログインページにリダイレクト
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 管理者向けページの認証チェック
  if (protectedAdminPaths.some(path => pathname.startsWith(path)) && 
      !pathname.startsWith('/admin/login') &&
      !pathname.startsWith('/admin/register')) {
    const token = request.cookies.get('admin_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      // 管理者ログインページにリダイレクト
      const adminLoginUrl = new URL('/admin/login', request.url)
      adminLoginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(adminLoginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

