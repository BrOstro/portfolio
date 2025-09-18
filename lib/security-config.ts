/**
 * Security configuration for the RAG retriever system
 *
 * This file contains security-related constants and configurations
 * that can be easily modified without touching the main retriever logic.
 */

// Document access control
export const ALLOWED_DOCUMENT_SLUGS = new Set([
	'resume',
	'about'
]);

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
	WINDOW_MS: 60 * 1000,
	MAX_REQUESTS: 10, // 10 requests per minute per IP
	CLEANUP_INTERVAL_MS: 5 * 60 * 1000, // Clean up old entries every 5 minutes
} as const;

// Input validation limits
export const INPUT_VALIDATION = {
	MAX_QUERY_LENGTH: 1000,
	MAX_SLUGS_PER_REQUEST: 10,
	MIN_QUERY_LENGTH: 1,
} as const;

// Security headers for API responses
export const SECURITY_HEADERS = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'X-XSS-Protection': '1; mode=block',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
} as const;

// Environment variable names for security settings
export const ENV_VARS = {
	OPENAI_API_KEY: 'OPENAI_API_KEY',
	RAG_EMBED_MODEL: 'RAG_EMBED_MODEL',
	RAG_CHAT_MODEL: 'RAG_CHAT_MODEL',
} as const;

// Logging configuration
export const LOGGING = {
	LOG_RATE_LIMIT_VIOLATIONS: true,
	LOG_VALIDATION_ERRORS: true,
	LOG_DATABASE_ERRORS: true,
	LOG_EMBEDDING_ERRORS: true,
} as const;
