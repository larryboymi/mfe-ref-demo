import { vi } from 'vitest'

class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length() {
    return this.store.size
  }

  clear = () => {
    this.store.clear()
  }

  getItem = (key: string) => (this.store.has(key) ? this.store.get(key)! : null)

  key = (index: number) => Array.from(this.store.keys())[index] ?? null

  removeItem = (key: string) => {
    this.store.delete(key)
  }

  setItem = (key: string, value: string) => {
    this.store.set(key, value)
  }
}

export const mockLocalStorage = () => {
  const storage = new MemoryStorage()
  vi.stubGlobal('localStorage', storage)
  return storage
}
