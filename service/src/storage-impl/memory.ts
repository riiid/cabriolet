import { Storage } from "../index";

export default function createMemoryStorage(): Storage {
  type Item = { value: Uint8Array; formatId: string };
  const storage = new Map<string, Item>();
  return {
    async has({ key }) {
      return { has: storage.has(key) };
    },
    async get({ key }) {
      if (!storage.has(key)) throw new Error("not found");
      return storage.get(key)!;
    },
    async getFormatId({ key }) {
      if (!storage.has(key)) throw new Error("not found");
      return { formatId: storage.get(key)!.formatId };
    },
    async set({ key, value, formatId }) {
      storage.set(key, { value, formatId });
      return {};
    },
    async delete({ key }) {
      storage.delete(key);
      return {};
    },
    async keys() {
      const keys = [...storage.keys()];
      return { keys };
    },
  };
}
