type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
) {
  const now = Date.now();
  const current = store.get(key);

  // First request or old window expired
  if (!current || now > current.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
    };
  }

  // Too many requests
  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil(
        (current.resetAt - now) / 1000
      ),
    };
  }

  current.count += 1;

  return {
    success: true,
    remaining: limit - current.count,
  };
}