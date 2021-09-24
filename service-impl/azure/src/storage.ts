import { Storage } from "@riiid/cabriolet-service";
import { BlobServiceClient} from "@azure/storage-blob";

export interface CreateAzureStorageConfig {}
export default function createAzureStorage(
  config: CreateAzureStorageConfig
): Storage {
  const client = new BlobServiceClient("http://0.0.0.0:10000")
  return {
    async has({ key }) {
      return {} as any; // TODO
    },
    async get({ key }) {
      return {} as any; // TODO
    },
    async getFormatId({ key }) {
      return {} as any; // TODO
    },
    async set({ key, value, formatId }) {
      return {} as any; // TODO
    },
    async delete({ key }) {
      return {} as any; // TODO
    },
    async keys({ prefix }) {
      return {} as any; // TODO
    },
  };
}
