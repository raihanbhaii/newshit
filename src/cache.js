const store = new Map();

export const Cache = {
  async get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    
    // Lazy cleanup: if expired, delete it and return null
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
  }
};
