/**
 * Turnstile verification utility
 * 
 * This module handles Cloudflare Turnstile CAPTCHA verification
 * to prevent abuse of the chat API.
 */

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

/**
 * Verify a Turnstile token with Cloudflare
 * @param token The Turnstile token to verify
 * @param remoteip Optional client IP address
 * @returns Promise<boolean> Whether the token is valid
 */
export async function verifyTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY environment variable is not set');
    return false;
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Turnstile verification request failed:', response.status, response.statusText);
      return false;
    }

    const result: TurnstileVerifyResponse = await response.json();
    
    if (!result.success) {
      console.warn('Turnstile verification failed:', result['error-codes']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

/**
 * Get client IP address from NextRequest
 * @param request The NextRequest object
 * @returns The client IP address
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  // Cloudflare provides the real client IP
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to other headers
  if (realIP) {
    return realIP;
  }
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Last resort - this might be a local development scenario
  return '127.0.0.1';
}
