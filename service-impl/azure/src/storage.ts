import { Storage } from "@riiid/cabriolet-service";
import { AzureStorageConfig } from "./azureStorageConfig";

export default function createAzureStorage(
  config: AzureStorageConfig
): Storage {
  return {
    async has({ key }) {
      return {
        has: await config.azureContainerClient.getBlobClient(key).exists(),
      };
    },
    async get({ key }) {
      const blobClient = await config.azureContainerClient.getBlockBlobClient(
        key
      );
      const exists = await blobClient.exists();
      if (!exists) {
        throw new Error(key + " blob does not exist");
      }
      const blob = await blobClient.downloadToBuffer(0);
      const blobMetadata = await blobClient.download(0);
      return {
        value: new Uint8Array(blob.buffer),
        formatId: blobMetadata.contentType!!,
      };
    },
    async getFormatId({ key }) {
      const blobClient = await config.azureContainerClient
        .getBlobClient(key)
        .download(0);
      if (!blobClient.contentType) throw new Error("format it does not exist");
      return { formatId: blobClient.contentType };
    },
    async set({ key, value, formatId }) {
      const options = { blobHTTPHeaders: { blobContentType: formatId } };
      await config.azureContainerClient.uploadBlockBlob(
        key,
        value,
        value.length,
        options
      );
      return {};
    },
    async delete({ key }) {
      return await config.azureContainerClient.deleteBlob(key);
    },
    async keys({ prefix }) {
      const iter = await config.azureContainerClient.listBlobsFlat({
        prefix: prefix,
      });
      const res: string[] = [];
      for await (const it of iter) {
        res.push(it.name);
      }
      return { keys: res };
    },
  };
}
