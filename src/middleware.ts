import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get the referrer
  const referrer = request.headers.get('referer');
  
  // Allow embedding from Farcaster domains and local development
  if (referrer && (
    referrer.includes('warpcast.com') || 
    referrer.includes('farcaster.xyz') ||
    referrer.includes('localhost') ||
    referrer.includes('127.0.0.1')
  )) {
    // Remove X-Frame-Options header to allow embedding
    response.headers.delete('X-Frame-Options');
    
    // Add Content-Security-Policy to explicitly allow embedding from these domains
    response.headers.set(
      'Content-Security-Policy',
      "frame-ancestors 'self' https://*.warpcast.com https://*.farcaster.xyz http://localhost:* http://127.0.0.1:*;"
    );
  } else {
    // For other referrers, set to SAMEORIGIN for security
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }
  
  return response;
}

// Run middleware on all routes
export const config = {
  matcher: '/:path*',
}; 