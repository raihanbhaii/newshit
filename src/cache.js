const store = new Map();

export const Cache = {
  async get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    return entry.value;
  },

  async set(key, value, ttlSeconds = 300) {
    store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  async del(key) {
    store.delete(key);
  },

  startCleanup(intervalMs = 60_000) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (now > entry.expiresAt) store.delete(key);
      }
    }, intervalMs);
  },
};
