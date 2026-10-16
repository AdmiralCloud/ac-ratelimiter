// minimal in-memory stand-in for the ioredis methods used by the limiter
class FakeRedis {
  constructor() {
    this.store = new Map()
  }

  _get(key) {
    const entry = this.store.get(key)
    if (entry && entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key)
      return undefined
    }
    return entry
  }

  async incr(key) {
    const entry = this._get(key) || { value: 0 }
    entry.value++
    this.store.set(key, entry)
    return entry.value
  }

  async decr(key) {
    const entry = this._get(key) || { value: 0 }
    entry.value--
    this.store.set(key, entry)
    return entry.value
  }

  async expire(key, seconds) {
    const entry = this._get(key)
    if (!entry) { return 0 }
    entry.expiresAt = Date.now() + seconds * 1000
    return 1
  }

  async get(key) {
    const entry = this._get(key)
    return entry ? entry.value : null
  }

  async flushall() {
    this.store.clear()
  }
}

module.exports = FakeRedis
