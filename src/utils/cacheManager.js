/**
 * Cache Manager
 * Simple in-memory cache with TTL (time-to-live) support
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Get value from cache
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set value in cache with optional TTL
   * TTL in milliseconds (default 5 minutes)
   */
  set(key, value, ttl = 5 * 60 * 1000) {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set cache value
    this.cache.set(key, value);

    // Set auto-expiry timer
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
      }, ttl);
      this.timers.set(key, timer);
    }

    return value;
  }

  /**
   * Check if key exists in cache
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete specific cache entry
   */
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get or set - if key exists, return cached value, otherwise call fetchFn and cache result
   */
  async getOrSet(key, fetchFn, ttl = 5 * 60 * 1000) {
    if (this.has(key)) {
      return this.get(key);
    }

    try {
      const value = await fetchFn();
      this.set(key, value, ttl);
      return value;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

export default cacheManager;
