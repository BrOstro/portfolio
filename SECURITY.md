# Security Features

This document outlines the security measures implemented in the RAG retriever system.

## Overview

The retriever system has been hardened with multiple layers of security to protect against common vulnerabilities and ensure safe operation in production environments.

## Security Features

### 1. Scope Allow-Listing
- **Purpose**: Prevents unauthorized access to sensitive documents
- **Implementation**: Only predefined document slugs are allowed
- **Configuration**: Defined in `lib/security-config.ts`
- **Allowed Slugs**: `resume`, `about`, `projects`, `experience`, `skills`

### 2. Parameterized SQL Queries
- **Purpose**: Prevents SQL injection attacks
- **Implementation**: All database queries use Drizzle ORM with parameterized queries
- **Protection**: Raw SQL injection is prevented through proper query building

### 3. Input Validation & Sanitization
- **Query Validation**:
  - Required and must be a string
  - Length limits (1-1000 characters)
  - Trimmed whitespace
- **Slug Validation**:
  - Must be strings
  - Sanitized to alphanumeric, hyphens, underscores only
  - Checked against allow-list
  - Limited to 10 slugs per request

### 4. Rate Limiting
- **Purpose**: Prevents abuse and DoS attacks
- **Configuration**: 10 requests per minute per IP address
- **Implementation**: In-memory rate limiting with automatic cleanup
- **Headers**: Supports various proxy configurations (X-Forwarded-For, X-Real-IP, CF-Connecting-IP)

### 5. Public Access (Portfolio Appropriate)
- **Design**: This is a public portfolio site, so the API is intentionally open
- **Protection**: Security comes from rate limiting, input validation, and scope allow-listing
- **Rationale**: API key authentication doesn't provide real security for client-side applications

### 6. Error Handling
- **Custom Error Types**: Structured error handling with specific error codes
- **Error Codes**:
  - `VALIDATION_ERROR` (400): Input validation failures
  - `RATE_LIMIT_EXCEEDED` (429): Rate limit violations
  - `DATABASE_ERROR` (500): Database operation failures
  - `EMBEDDING_ERROR` (500): OpenAI API failures
  - `UNEXPECTED_ERROR` (500): Unexpected system errors

### 7. Logging & Monitoring
- **Configurable Logging**: Toggle logging for different error types
- **Security Events**: Rate limit violations, validation errors, database/API failures
- **Error Details**: Structured logging with relevant context

### 8. Security Headers
- **Content Security Policy**: Restricts resource loading
- **XSS Protection**: Browser XSS filtering enabled
- **Content Type Options**: Prevents MIME type sniffing
- **Frame Options**: Prevents clickjacking attacks

## Configuration

### Environment Variables
```bash
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional
RAG_EMBED_MODEL=text-embedding-3-small
RAG_CHAT_MODEL=gpt-4o-mini
```

### Security Configuration
Modify `lib/security-config.ts` to adjust:
- Allowed document slugs
- Rate limiting parameters
- Input validation limits
- Security headers
- Logging preferences

## Usage Examples

### Basic Request
```javascript
const response = await fetch('/api/rag', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'What is your experience?',
    slug: 'resume'
  })
});
```

### Error Handling
```javascript
try {
  const response = await fetch('/api/rag', { /* ... */ });
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Error:', data.error);
    console.error('Code:', data.code);
    console.error('Details:', data.details);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## Security Best Practices

1. **Monitor Logs**: Regularly check logs for security events
2. **Update Allow-List**: Review and update allowed document slugs as needed
3. **Rate Limit Tuning**: Adjust rate limits based on usage patterns
4. **Regular Updates**: Keep dependencies updated for security patches
5. **Environment Security**: Keep OpenAI API keys secure and rotate regularly

## Threat Mitigation

| Threat | Mitigation |
|--------|------------|
| SQL Injection | Parameterized queries with Drizzle ORM |
| Unauthorized Access | Scope allow-listing (public portfolio) |
| DoS Attacks | Rate limiting + input validation |
| Data Exfiltration | Document slug allow-listing |
| XSS Attacks | Input sanitization + security headers |
| Information Disclosure | Structured error handling without sensitive data |

## Monitoring

The system logs the following security events:
- Rate limit violations
- Input validation errors
- Database errors
- Embedding API errors

Monitor these logs to detect potential security issues and abuse patterns.
