import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import createAzureStorage from "../src";
import { AzureStorageConfig } from "../src/azureStorageConfig";
import * as crypto from "crypto";
import { Storage } from "@riiid/cabriolet-service";

// docker run -p 10000:10000 mcr.microsoft.com/azure-storage/azurite azurite-blob --blobHost 0.0.0.0 --loose
let storage: Storage;
const containerName = "testcontainer2";
const host = "http://127.0.0.1:10000/devstoreaccount1";
const accountName = "devstoreaccount1";
const accountKey =
  "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
beforeAll(() => {
  try {
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    const client = new BlobServiceClient(host, credential);
    const containerClient = client.getContainerClient(containerName);
    containerClient.createIfNotExists();
    const azureStorageConfig: AzureStorageConfig = {
      azureContainerClient: containerClient,
    };
    storage = createAzureStorage(azureStorageConfig);
  } catch (e) {
    console.log(e);
  }
});

afterAll(() => {
  try {
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    const client = new BlobServiceClient(host, credential);

    client.deleteContainer(containerName);
  } catch (e) {
    console.log(e);
  }
});

describe("AzureStorageTest", () => {
  describe("get", () => {
    test("when get blob after saving one, then retrieves successfully", async () => {
      // given
      const formatId = crypto.randomUUID() + "testFormatId";
      const key = crypto.randomUUID();
      const rndInt = Math.floor(Math.random() * 25) + 1;
      await storage.set({
        key: key,
        value: new Uint8Array(rndInt),
        formatId: formatId,
      });

      // when
      const res = await storage.get({ key });

      // then
      expect(res.value.byteLength).toEqual(rndInt);
      expect(res.formatId).toEqual(formatId);
    });
  });

  describe("has", () => {
    test("when check blob exists after save, then return result successfully", async () => {
      // given
      const formatId = crypto.randomUUID() + "testFormatId";
      const key = crypto.randomUUID();
      const rndInt = Math.floor(Math.random() * 25) + 1;
      await storage.set({
        key: key,
        value: new Uint8Array(rndInt),
        formatId: formatId,
      });

      // when
      const res = await storage.has({ key });

      // then
      expect(res.has).toEqual(true);
    });
  });

  describe("getFormatId", () => {
    test("when save blob, then return formatId successfully", async () => {
      // given
      const formatId = crypto.randomUUID() + "testFormatId";
      const key = crypto.randomUUID();
      const rndInt = Math.floor(Math.random() * 25) + 1;
      await storage.set({
        key: key,
        value: new Uint8Array(rndInt),
        formatId: formatId,
      });

      // when
      const res = await storage.getFormatId({ key });

      // then
      expect(res.formatId).toEqual(formatId);
    });
  });

  describe("delete", () => {
    test("when delete saved blob, then return false", async () => {
      // given
      const formatId = crypto.randomUUID() + "testFormatId";
      const key = crypto.randomUUID();
      const rndInt = Math.floor(Math.random() * 25) + 1;
      await storage.set({
        key: key,
        value: new Uint8Array(rndInt),
        formatId: formatId,
      });

      // when
      await storage.delete({ key });
      const res = await storage.has({ key });

      // then
      expect(res.has).toEqual(false);
    });
  });

  describe("keys", () => {
    test("save with unique prefix, then filter blob keys successfully", async () => {
      // given
      const prefix = "keysTestFormatId";
      const formatId = prefix + crypto.randomUUID();
      const key = prefix + crypto.randomUUID();
      const rndInt = Math.floor(Math.random() * 25) + 1;
      await storage.set({
        key: key,
        value: new Uint8Array(rndInt),
        formatId: formatId,
      });

      // when
      const res = await storage.keys({ prefix });

      // then
      expect(res.keys.length).toEqual(1);
    });
  });
});
