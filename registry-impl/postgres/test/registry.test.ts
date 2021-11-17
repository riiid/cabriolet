import { Pool, PoolClient } from "pg";
import createAzureRegistry from "../src";
import { PostgresDatabaseConfig } from "../src/postgresDatabaseConfig";
import { Registry } from "@riiid/cabriolet-service";
import { migrate } from "postgres-migrations";
import * as path from "path";
import * as crypto from "crypto";

let pool: Pool;
let registry: Registry;
const dbName = "test-db";
const user = "test-user";
const host = "localhost";
const port = "5432";
const migrationsDirectory = path.resolve("./src/migrations");
const connectionSting = `postgres://${user}@${host}:${port}/${dbName}`;

beforeAll(async () => {
  pool = await new Pool({
    connectionString: connectionSting,
  });
  const config: PostgresDatabaseConfig = {
    pool: pool,
  };

  const client = await config.pool.connect();
  try {
    await migrate({ client }, migrationsDirectory);
  } finally {
    await client.release();
  }

  registry = createAzureRegistry(config);
});

afterEach(async () => {
  const client = await pool.connect();
  const sql = `DELETE
               FROM formats;
  DELETE
  FROM converters;
  DELETE
  FROM validators`;
  await client.query(sql);
  await client.release();
});

afterAll(() => {
  pool.end();
});

describe("CreateRegistryTest", () => {
  describe("getSchema", () => {
    it("when get schema then gets successfully", async () => {
      // when
      const res = await registry.getSchema({});

      // then
      expect(res.schema!.formats).toEqual([]);
      expect(res.schema!.converters).toEqual([]);
      expect(res.schema!.validators).toEqual([]);
    });
  });

  describe("createFormat", () => {
    it("when create format then format is added to schema successfully", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";

      // when
      await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });

      const res = await registry.getSchema({});

      // then
      expect(res.schema!!.formats[0].name).toEqual(formatName);
      expect(res.schema!!.formats[0].description).toEqual(formatDescription);
    });
  });

  describe("deleteFormat", () => {
    it("when delete format then format does not exist in formats", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const { formatId } = await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });

      // when
      const beforeSchema = await registry.getSchema({});
      await registry.deleteFormat({ formatId });
      const afterSchema = await registry.getSchema({});

      // then
      expect(beforeSchema.schema!!.formats[0].id).toEqual(formatId);
      expect(beforeSchema.schema!!.formats[0].name).toEqual(formatName);
      expect(beforeSchema.schema!!.formats[0].description).toEqual(
        formatDescription
      );
      expect(afterSchema.schema!!.formats.length).toEqual(0);
    });
  });

  describe("appendValidator", () => {
    it("when create validator then validatorId is added in format successfully and validator is added successfully", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const validatorName = crypto.randomUUID() + "_validatorDescription";
      const validatorDescription =
        crypto.randomUUID() + "_validatorDescription";
      const validationSrc = crypto.randomUUID() + "_validatorSrc";
      const validationIntegrity = crypto.randomUUID() + "_validatorIntegrity";
      const { formatId } = await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });

      // when
      await registry
        .appendValidator({
          formatId: formatId,
          validatorName: validatorName,
          validatorDescription: validatorDescription,
          validatorSrc: validationSrc,
          validatorIntegrity: validationIntegrity,
        })
        .then((res) => {
          const validatorId = res.validatorId;
          registry.getSchema({}).then((res) => {
            const schema = res.schema;

            // then
            const validator = schema!.validators[0];
            expect(schema!!.formats[0].validatorIds[0]).toBe(
              validatorId.toString()
            );
            expect(validator.id).toEqual(validatorId);
            expect(validator.name).toEqual(validatorName);
            expect(validator.description).toEqual(validatorDescription);
            expect(validator.src).toEqual(validationSrc);
            expect(validator.integrity).toEqual(validationIntegrity);
          });
        });
    });
  });

  describe("removeValidator", () => {
    it("when delete validator then validatorId is deleted from format and validator is deleted successfully", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const validatorName = crypto.randomUUID() + "_validatorDescription";
      const validatorDescription =
        crypto.randomUUID() + "_validatorDescription";
      const validationSrc = crypto.randomUUID() + "_validatorSrc";
      const validationIntegrity = crypto.randomUUID() + "_validatorIntegrity";
      const { formatId } = await registry.createFormat({
        formatName: formatName,
        formatDescription: formatDescription,
      });
      const { validatorId } = await registry.appendValidator({
        formatId: formatId,
        validatorName: validatorName,
        validatorDescription: validatorDescription,
        validatorSrc: validationSrc,
        validatorIntegrity: validationIntegrity,
      });

      // when
      const beforeSchema = await registry.getSchema({});
      await registry.removeValidator({
        formatId: formatId,
        validatorId: validatorId,
      });
      const afterSchema = await registry.getSchema({});

      // then
      const validator = beforeSchema.schema!!.validators[0];
      expect(validator.id).toEqual(validatorId);
      expect(afterSchema.schema!!.validators.length).toEqual(0);
      expect(afterSchema.schema!!.formats[0].validatorIds.length).toEqual(0);
    });
  });

  describe("createConverter", () => {
    it("when create converter then add converter", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const formatId1 = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const formatId2 = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const converterName = crypto.randomUUID() + "_converterName";
      const converterDescription =
        crypto.randomUUID() + "_converterDescription";
      const converterSrc = crypto.randomUUID() + "_converterSrc";
      const converterIntegrity = crypto.randomUUID() + "_converterIntegrity";

      // when
      const { fromFormatId, toFormatId } = await registry.createConverter({
        fromFormatId: formatId1,
        toFormatId: formatId2,
        converterName: converterName,
        converterDescription: converterDescription,
        converterSrc: converterSrc,
        converterIntegrity: converterIntegrity,
      });
      const schema = await registry.getSchema({});

      // then
      expect(schema.schema!!.converters[0].fromFormatId).toEqual(fromFormatId);
      expect(schema.schema!!.converters[0].toFormatId).toEqual(toFormatId);
      expect(schema.schema!!.converters[0].name).toEqual(converterName);
      expect(schema.schema!!.converters[0].src).toEqual(converterSrc);
      expect(schema.schema!!.converters[0].integrity).toEqual(
        converterIntegrity
      );
    });
  });

  describe("deleteConverter", () => {
    it("when delete converter then converter are deleted", async () => {
      // given
      const formatName = crypto.randomUUID() + "_formatName";
      const formatDescription = crypto.randomUUID() + "_formatDescription";
      const formatId1 = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const formatId2 = (
        await registry.createFormat({
          formatName: formatName,
          formatDescription: formatDescription,
        })
      ).formatId;
      const converterName = crypto.randomUUID() + "_converterName";
      const converterDescription =
        crypto.randomUUID() + "_converterDescription";
      const converterSrc = crypto.randomUUID() + "_converterSrc";
      const converterIntegrity = crypto.randomUUID() + "_converterIntegrity";
      const { fromFormatId, toFormatId } = await registry.createConverter({
        fromFormatId: formatId1,
        toFormatId: formatId2,
        converterName: converterName,
        converterDescription: converterDescription,
        converterSrc: converterSrc,
        converterIntegrity: converterIntegrity,
      });

      // when
      await registry.deleteConverter({ fromFormatId, toFormatId });
      const schema = await registry.getSchema({});

      // then
      expect(schema.schema!!.converters.length).toEqual(0);
    });
  });
});
