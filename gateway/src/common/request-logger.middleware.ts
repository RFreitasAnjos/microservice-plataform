import { Request, Response, NextFunction } from "express";
import { logger } from "../logger/logger";

const SENSITIVE_KEY_PATTERN = /(pass(word)?|pwd|token|secret|authorization|cookie|api[-_]?key|refresh[-_]?token|access[-_]?token|client[-_]?secret|cvv|card)/i;

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (depth > 5) {
    return '[TRUNCATED]';
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, depth + 1));
  }

  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeValue(nestedValue, depth + 1);
      }
    }

    return sanitized;
  }

  return value;
}

function sanitizeHeaders(headers: Request['headers']): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startedAt = Date.now();

  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      headers: sanitizeHeaders(req.headers),
      params: sanitizeValue(req.params),
      query: sanitizeValue(req.query),
      body: sanitizeValue(req.body)
    });
  });

  next();

}